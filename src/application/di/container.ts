import { DeviceRepositoryImpl, TagRepositoryImpl } from "@infra/repositories";
import {
  GetDevicesUseCase,
  GetDeviceByIdUseCase,
  GetTagsByDeviceUseCase,
} from "@core/use-cases";

/** Simple service locator for use cases and repositories. */
export const container = (() => {
  const deviceRepository = new DeviceRepositoryImpl();
  const tagRepository = new TagRepositoryImpl();

  return {
    repositories: {
      deviceRepository,
      tagRepository,
    },
    useCases: {
      getDevices: new GetDevicesUseCase(deviceRepository),
      getDeviceById: new GetDeviceByIdUseCase(deviceRepository),
      getTagsByDevice: new GetTagsByDeviceUseCase(tagRepository),
    },
  };
})();
