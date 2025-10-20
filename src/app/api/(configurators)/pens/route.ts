import { createMaterial } from "@/app/lib/configuratorFunctions"
import { getPenMaterialsWeights } from "@/app/lib/orderFunction"

export async function  GET(_request: Request) {
    const data = await getPenMaterialsWeights(5);
    return Response.json(data)
}