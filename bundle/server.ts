// 简单的 HTTP 服务器用于测试构建结果

const requestHandler = async (request: Request): Promise<Response> => {
  const url = new URL(request.url);
  let filepath = url.pathname;

  // 默认访问 index.html
  if (filepath === "/") {
    filepath = "/index.html";
  }

  try {
    const file = await Deno.readFile(`./dist${filepath}`);

    // 设置正确的 Content-Type
    let contentType = "text/plain";
    if (filepath.endsWith(".html")) {
      contentType = "text/html";
    } else if (filepath.endsWith(".js")) {
      contentType = "application/javascript";
    } else if (filepath.endsWith(".css")) {
      contentType = "text/css";
    }

    return new Response(file, {
      headers: { "Content-Type": contentType },
    });
  } catch {
    return new Response("404 Not Found", { status: 404 });
  }
};

console.log("🚀 Server running at http://localhost:8001");
console.log("📁 Serving files from ./dist directory");

// 使用 Deno 内置的 HTTP 服务器
Deno.serve({ port: 8000 }, requestHandler);

export { };