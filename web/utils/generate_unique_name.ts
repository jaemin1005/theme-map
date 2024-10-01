import { createHash } from "crypto";

export function generateUniqueName(arrayBuffer: ArrayBuffer): string {
  const hash = createHash("sha256")
    .update(Buffer.from(arrayBuffer))
    .digest("hex");
  return hash;
}
