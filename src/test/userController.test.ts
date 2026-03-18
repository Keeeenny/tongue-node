import { expect } from "chai";
import * as userController from "../controllers/userController";
import { ID } from "../utils/types";

describe("userController - (Integration)", () => {
  let idUser: ID;

  const createRequest = () =>
    ({
      body: {
        nickname: "Froid",
        age: 35,
        city: "Praga",
      },
    }) as any;

  const updateRequest = () =>
    ({
      params: { id: idUser },
      body: {
        nickname: "Gianni",
        age: 28,
        city: "Berlin",
      },
    }) as any;

  const patchNicknameRequest = () =>
    ({
      params: { id: idUser },
      body: {
        nickname: "Arnold",
      },
    }) as any;

  const patchAgeRequest = () =>
    ({
      params: { id: idUser },
      body: {
        age: 78,
      },
    }) as any;

  const patchCityRequest = () =>
    ({
      params: { id: idUser },
      body: {
        city: "Stiria",
      },
    }) as any;

  const deleteRequest = () =>
    ({
      params: { id: idUser },
    }) as any;

  const createResponseMock = () => {
    return {
      statusCode: 0,
      body: {},
      status: function (c: any) {
        this.statusCode = c;
        return this;
      },
      json: function (d: any) {
        this.body = d;
        return this;
      },
    } as any;
  };

  //Check
  afterEach(async function () {
    const res = createResponseMock();
    await userController.readUsers({} as any, res);

    console.log("\n--- Actual DB state ---");
    console.table(res.body.data);
  });

  //Create
  it("should create a new user", async function () {
    const req = createRequest();
    const res = createResponseMock();

    await userController.createUser(req, res);

    expect(res.statusCode, `Creation failed: ${res.body.message}`).to.equal(201);
    expect(res.body.status).to.equal("success");

    idUser = res.body.data.id;

    expect(idUser).to.be.a("number");
    console.log(res.body.message, "ID: ", idUser);
  });

  //Update
  it("Should update the user", async function () {
    if (!idUser)
      throw new Error("idUser is missing! Create test must pass first.");

    const req = updateRequest();
    const res = createResponseMock();

    await userController.updateUser(req, res);

    expect(res.statusCode, `Update failed: ${res.body.message}`).to.equal(200);
    expect(res.body.status).to.equal("success");
    console.log("User updated");
  });

  //patch nickname
  it("Should patch the user nickname", async function () {
    if (!idUser)
      throw new Error("idUser is missing! Create test must pass first.");
    const req = patchNicknameRequest();
    const res = createResponseMock();

    await userController.patchUser(req, res);

    expect(res.statusCode, `Patch nickname failed: ${res.body.message}`).to.equal(200);
    expect(res.body.status).to.equal("success");
    console.log("User nickname updated");
  });

  //patch age
  it("Should patch the user age", async function () {
    if (!idUser)
      throw new Error("idUser is missing! Create test must pass first.");
    const req = patchAgeRequest();
    const res = createResponseMock();

    await userController.patchUser(req, res);

    expect(res.statusCode, `Patch age failed: ${res.body.message}`).to.equal(200);
    expect(res.body.status).to.equal("success");
    console.log("User age updated");
  });

  //patch city
  it("Should patch the user city", async function () {
    if (!idUser)
      throw new Error("idUser is missing! Create test must pass first.");
    const req = patchCityRequest();
    const res = createResponseMock();

    await userController.patchUser(req, res);

    expect(res.statusCode, `Patch city failed: ${res.body.message}`).to.equal(200);
    expect(res.body.status).to.equal("success");
    console.log("User city updated");
  });

  //Delete
  it("Should delete an user", async function () {
    if (!idUser)
      throw new Error("idUser is missing! Create test must pass first.");
    const req = deleteRequest();
    const res = createResponseMock();

    await userController.deleteUser(req, res);

    expect(res.statusCode, `Deletion failed: ${res.body.message}`).to.equal(200);
    expect(res.body.status).to.equal("success");
    console.log("User deleted");
  });
});