import { CONFIG } from "@/config";
import { MinioStorageProvider } from "./implements/minio-implementation";

const providers = {
  MINIO: new MinioStorageProvider(),
};

export const storageProvider =
  providers[CONFIG.providers.storage.provider as keyof typeof providers];
