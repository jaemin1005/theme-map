import { createHash } from "crypto"; 

export async function generateUniqueName(blob: Blob): Promise<string> {
  const arrayBuffer = await blob.arrayBuffer();
  const hash = createHash('sha256').update(Buffer.from(arrayBuffer)).digest('hex');
  return hash;
}