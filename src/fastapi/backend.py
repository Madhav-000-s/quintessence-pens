# main.py
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.concurrency import run_in_threadpool
from pydantic import BaseModel
from typing import List, Dict, Any
from penrecommendation import PenRecommendationSystem, SyntheticDataGenerator
from designgenerator import (
    CustomPenDesignSuggestionSystem,
    DesignSyntheticDataGenerator,
    SyntheticDataGenerator as DesignDataGenerator,
    train_and_save_design_suggester,
)
import os
import uvicorn
import numpy as np
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("pen_api")

# -----------------------
# Helpers
# -----------------------
def to_serializable(obj: Any) -> Any:
    """Recursively convert NumPy types / arrays and other non-serializable objects to native Python."""
    if isinstance(obj, dict):
        return {k: to_serializable(v) for k, v in obj.items()}
    if isinstance(obj, (list, tuple)):
        return [to_serializable(v) for v in obj]
    if isinstance(obj, np.ndarray):
        return obj.tolist()
    if isinstance(obj, (np.integer,)):
        return int(obj)
    if isinstance(obj, (np.floating,)):
        return float(obj)
    # Add special-case conversions if your models return pandas types:
    try:
        # pandas types often implement .item()
        import pandas as pd  # optional import
        if isinstance(obj, (pd.Series, pd.DataFrame)):
            return obj.to_dict(orient="records") if isinstance(obj, pd.DataFrame) else obj.tolist()
    except Exception:
        pass
    return obj

def normalize_recommendations(recommendations: Any) -> List[Dict]:
    """
    Normalize recommender output into a list of dicts with python-native types.
    Accepts:
      - [1,2,3]
      - np.array([1,2,3])
      - [{"pen_id": 1, "score": 0.9}, ...]
    Returns something like:
      [{"pen_id": 1, "score": 0.9}, ...] or [{"pen_id": 1}] if score not present
    """
    if recommendations is None:
        return []
    # numpy array of ints
    if isinstance(recommendations, np.ndarray):
        return [{"pen_id": int(x)} for x in recommendations.tolist()]

    # list of plain ints
    if isinstance(recommendations, list) and all(isinstance(x, (int, np.integer)) for x in recommendations):
        return [{"pen_id": int(x)} for x in recommendations]

    # list of dicts — convert each dict
    if isinstance(recommendations, list) and all(isinstance(x, dict) for x in recommendations):
        normalized = []
        for r in recommendations:
            nr = {}
            if "pen_id" in r:
                nr["pen_id"] = int(r["pen_id"])
            # copy any numeric / string fields with safe conversion
            if "score" in r:
                nr["score"] = float(r["score"])
            # include any other fields, convert them
            for k, v in r.items():
                if k in ("pen_id", "score"):
                    continue
                nr[k] = to_serializable(v)
            normalized.append(nr)
        return normalized

    # single dict with keys -> wrap
    if isinstance(recommendations, dict):
        return [to_serializable(recommendations)]

    # fallback: try to coerce to list of ints
    try:
        return [{"pen_id": int(x)} for x in list(recommendations)]
    except Exception:
        # final fallback: return stringified version
        return [ {"value": to_serializable(recommendations)} ]

# -----------------------
# Load Models & Data
# -----------------------
logger.info("Initializing models and synthetic data...")

recommender = PenRecommendationSystem()
recommender.load_model("pen_recommender")

gen = SyntheticDataGenerator()
materials_df = gen.generate_materials(10)
designs_df = gen.generate_designs(8)
coatings_df = gen.generate_coatings(6)
ink_configs_df = gen.generate_ink_configs(10)
nib_configs_df = gen.generate_nib_configs(12)
barrel_configs_df = gen.generate_barrel_configs(15)
cap_configs_df = gen.generate_cap_configs(12)
engravings_df = gen.generate_engravings(12)
pens_df = gen.generate_pens(50)
user_interactions_df = gen.generate_user_interactions(500, 50)

pen_features = recommender.prepare_pen_features(
    pens_df, ink_configs_df, barrel_configs_df, cap_configs_df, nib_configs_df
)
recommender.compute_content_similarity(pen_features)

# --- Design Suggestion Setup ---
MODEL_BASE = "design_suggester"
if not (os.path.exists(f"{MODEL_BASE}.keras") and os.path.exists(f"{MODEL_BASE}_meta.pkl")):
    logger.info("Design model artifacts not found — training now...")
    train_and_save_design_suggester(MODEL_BASE)

suggester = CustomPenDesignSuggestionSystem()
suggester.load_model(MODEL_BASE)

_design_data_gen = DesignDataGenerator()
_materials_df = _design_data_gen.generate_materials(10)
_designs_df = _design_data_gen.generate_designs(8)
_coatings_df = _design_data_gen.generate_coatings(6)
_ink_configs_df = _design_data_gen.generate_ink_configs(10)
_nib_configs_df = _design_data_gen.generate_nib_configs(12)
_barrel_configs_df = _design_data_gen.generate_barrel_configs(15)
_cap_configs_df = _design_data_gen.generate_cap_configs(12)
_engravings_df = _design_data_gen.generate_engravings(12)
_pens_df = _design_data_gen.generate_pens(50)

_likes_gen = DesignSyntheticDataGenerator()
_user_likes_df = _likes_gen.generate_user_liked_pens(
    n_users=500,
    pens_df=_pens_df,
    ink_df=_ink_configs_df,
    barrel_df=_barrel_configs_df,
    nib_df=_nib_configs_df,
)

suggester.prepare_component_features(
    _pens_df,
    _ink_configs_df,
    _barrel_configs_df,
    _cap_configs_df,
    _nib_configs_df,
    _engravings_df,
    _materials_df,
    _designs_df,
    _coatings_df,
)

# -----------------------
# FastAPI App
# -----------------------
app = FastAPI(title="Pen Intelligence API", version="1.2")

# CORS — in dev you can allow "*", but lock down in production.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class RecommendationRequest(BaseModel):
    user_id: int
    visited_pens: List[int]

class DesignRequest(BaseModel):
    user_id: int

@app.get("/")
def root():
    return {"message": "Pen Recommendation API is running! Visit /docs to test."}

@app.post("/recommend")
def recommend_pens(request: RecommendationRequest) -> Dict:
    try:
        raw_recs = recommender.get_hybrid_recommendations(
            request.user_id, request.visited_pens[:3], top_n=3
        )
        normalized = normalize_recommendations(raw_recs)
        return {"recommendations": normalized}
    except Exception as exc:
        logger.exception("Error in /recommend")
        raise HTTPException(status_code=500, detail=str(exc))

@app.post("/design/suggest")
def suggest_design(request: DesignRequest) -> Dict:
    try:
        raw_design = suggester.suggest_custom_design(request.user_id, _user_likes_df, _pens_df)
        return {"design": to_serializable(raw_design)}
    except Exception as exc:
        logger.exception("Error in /design/suggest")
        raise HTTPException(status_code=500, detail=str(exc))

# -----------------------
# Admin: Retrain endpoints (run in threadpool)
# -----------------------
@app.post("/admin/retrain/recommender")
async def retrain_recommender() -> Dict:
    try:
        def do_train():
            gen_local = SyntheticDataGenerator()
            ink_df = gen_local.generate_ink_configs(10)
            barrel_df = gen_local.generate_barrel_configs(15)
            cap_df = gen_local.generate_cap_configs(12)
            nib_df = gen_local.generate_nib_configs(12)
            pens_df_local = gen_local.generate_pens(50)
            interactions_df_local = gen_local.generate_user_interactions(500, 50)

            global recommender, pen_features  # modify globals
            recommender = PenRecommendationSystem()
            pen_features = recommender.prepare_pen_features(pens_df_local, ink_df, barrel_df, cap_df, nib_df)
            recommender.train_collaborative_filtering(interactions_df_local, epochs=10, batch_size=512)
            recommender.compute_content_similarity(pen_features)
            recommender.save_model("pen_recommender")
            return {"status": "ok", "message": "Recommender retrained and saved."}

        result = await run_in_threadpool(do_train)
        return result
    except Exception as exc:
        logger.exception("Error in retrain_recommender")
        raise HTTPException(status_code=500, detail=str(exc))

@app.post("/admin/retrain/designer")
async def retrain_designer() -> Dict:
    try:
        def do_train_designer():
            global suggester, _user_likes_df, _pens_df
            train_and_save_design_suggester(MODEL_BASE)
            suggester = CustomPenDesignSuggestionSystem()
            suggester.load_model(MODEL_BASE)

            _design_data_gen_local = DesignDataGenerator()
            _ink = _design_data_gen_local.generate_ink_configs(10)
            _nib = _design_data_gen_local.generate_nib_configs(12)
            _barrel = _design_data_gen_local.generate_barrel_configs(15)
            _cap = _design_data_gen_local.generate_cap_configs(12)
            _engraving = _design_data_gen_local.generate_engravings(12)
            _materials = _design_data_gen_local.generate_materials(10)
            _designs = _design_data_gen_local.generate_designs(8)
            _coatings = _design_data_gen_local.generate_coatings(6)
            _pens_df = _design_data_gen_local.generate_pens(50)

            _likes_gen_local = DesignSyntheticDataGenerator()
            _user_likes_df = _likes_gen_local.generate_user_liked_pens(
                n_users=500, pens_df=_pens_df, ink_df=_ink, barrel_df=_barrel, nib_df=_nib
            )
            suggester.prepare_component_features(
                _pens_df, _ink, _barrel, _cap, _nib, _engraving, _materials, _designs, _coatings
            )
            return {"status": "ok", "message": "Designer retrained and reloaded."}

        result = await run_in_threadpool(do_train_designer)
        return result
    except Exception as exc:
        logger.exception("Error in retrain_designer")
        raise HTTPException(status_code=500, detail=str(exc))

# -----------------------
# Run
# -----------------------
if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)
