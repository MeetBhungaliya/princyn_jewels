import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import path from "node:path";
import { type NextRequest } from "next/server";

const mimeTypes: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  gif: "image/gif",
  svg: "image/svg+xml",
};

const defaultUploadPath = process.env.UPLOAD_PATH;

function getUploadRoot() {
  const configuredRoot = process.env.UPLOAD_PATH?.trim();
  return configuredRoot || defaultUploadPath;
}

function isPathInsideRoot(root: string, target: string) {
  const relativePath = path.relative(root, target);
  return relativePath !== "" && !relativePath.startsWith("..") && !path.isAbsolute(relativePath);
}

export const runtime = "nodejs";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path: pathSegments } = await params;
    if (!pathSegments || pathSegments.length === 0) {
      return new Response("Not Found", { status: 404 });
    }

    // Safely prevent directory traversal
    if (pathSegments.some((seg) => seg === ".." || seg === ".")) {
      return new Response("Not Found", { status: 404 });
    }

    const uploadRoot = getUploadRoot();
    const relativePath = pathSegments.join("/");
    const resolvedPath = path.resolve(uploadRoot, relativePath);

    if (!isPathInsideRoot(uploadRoot, resolvedPath)) {
      return new Response("Not Found", { status: 404 });
    }

    // Get file extension and validate mimetype support
    const ext = path.extname(resolvedPath).toLowerCase().replace(/^\./, "");
    const contentType = mimeTypes[ext];
    if (!contentType) {
      return new Response("Not Found", { status: 404 });
    }

    // Verify file existence
    const fileStats = await stat(resolvedPath);
    if (!fileStats.isFile()) {
      return new Response("Not Found", { status: 404 });
    }

    // Stream the file instead of loading completely into memory
    const nodeStream = createReadStream(resolvedPath);
    const webStream = new ReadableStream({
      start(controller) {
        nodeStream.on("data", (chunk) => controller.enqueue(chunk));
        nodeStream.on("end", () => controller.close());
        nodeStream.on("error", (err) => controller.error(err));
      },
      cancel() {
        nodeStream.destroy();
      },
    });

    return new Response(webStream, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Length": fileStats.size.toString(),
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    return new Response("Not Found", { status: 404 });
  }
}
