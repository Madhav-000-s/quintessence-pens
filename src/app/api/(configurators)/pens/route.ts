import { createMaterial } from "@/app/lib/configuratorFunctions"

export async function  GET(_request: Request) {
    const data = await createMaterial("Ruby", 4);
    return Response.json(data)
}