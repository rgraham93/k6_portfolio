import { SeekMode } from 'k6/experimental/fs';

// readAll helper function from Grafana k6 documentation
export async function readAll(file) {
  // Seek to the beginning of the file
  await file.seek(0, SeekMode.Start);

  const fileInfo = await file.stat();
  const buffer = new Uint8Array(fileInfo.size);

  const bytesRead = await file.read(buffer);
  if (bytesRead !== fileInfo.size) {
    throw new Error(
      'unexpected number of bytes read; expected ' +
        fileInfo.size +
        ' but got ' +
        bytesRead +
        ' bytes'
    );
  }

  return buffer;
}