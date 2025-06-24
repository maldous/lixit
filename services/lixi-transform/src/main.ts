console.log("LIXI Transform Service");

export class LIXITransformService {
  async transform(
    data: Record<string, unknown>,
  ): Promise<Record<string, unknown>> {
    return data;
  }
}

export const lixiTransformService = new LIXITransformService();
