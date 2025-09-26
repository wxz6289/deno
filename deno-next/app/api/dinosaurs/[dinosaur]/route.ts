import data from '../../data.json' with { type: "json" };

type RouteParams = { params: Promise<{ dinosaur: string }> };
export async function GET(_request: Request, { params }: RouteParams) {
  const { dinosaur: id } = await params;
  if (!id) {
    return Response.json({ error: "Dinosaur ID is required" }, { status: 400 });
  }
  const dinosaur = data.find((d) => d.name.toLowerCase() === id.toLowerCase());
  if (!dinosaur) {
    return Response.json({ error: "Dinosaur not found" }, { status: 404 });
  }
  return Response.json(dinosaur);
}