//Mocks
export const createResponseMock = () => {
  return {
    statusCode: 0,
    body: {} as any,
    status: function (c: number) {
      this.statusCode = c;
      return this;
    },
    json: function (d: any) {
      this.body = d;
      return this;
    },
  } as any;
};
