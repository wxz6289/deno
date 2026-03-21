import { Head } from "fresh/runtime";
import data from "../api/data.json" with { type: "json" };
import { Button } from "../../components/Button.tsx";
import FavoriteButton from "../../islands/FavoriteButton.tsx";
import { define } from "../../utils.ts";

export default define.page(function DinosaurPage({ params }) {
  const { name } = params;
  const dinosaur = data.find((d) =>
    d.name.toLowerCase() === name.toLowerCase()
  );

  if (!dinosaur) {
    return (
      <div className="container py-12">
        <h1 className="text-2xl font-semibold">未找到恐龙</h1>
        <p className="text-muted">检查拼写或返回列表。</p>
        <div className="mt-4">
          <Button href="/" class="bg-indigo-600 text-white">返回</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="fresh-gradient min-h-screen py-12">
      <div className="container">
        <Head>
          <title>{dinosaur.name} · Dinosaur</title>
        </Head>

        <div className="dinosaur-card flex flex-col sm:flex-row gap-4">
          <div className="w-40 h-40 bg-gray-100 rounded-md flex items-center justify-center text-3xl font-semibold">
            {dinosaur.name.charAt(0)}
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-semibold">{dinosaur.name}</h1>
            <p className="text-muted mt-2">{dinosaur.description}</p>
            <div className="mt-4 flex items-center gap-3">
              <FavoriteButton />
              <Button href="/" class="bg-indigo-600 text-white">
                返回列表
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
