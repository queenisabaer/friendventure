import { rest } from "msw";
const baseUrl = "https://friendventure-api-8b417af3d1a0.herokuapp.com/";

export const handlers = [
  rest.get(`${baseUrl}dj-rest-auth/user/`, (req, res, ctx) => {
    return res(
      ctx.json({
        pk: 1,
        username: "queenisabaer",
        email: "dajanaisbaner@gmx.de",
        first_name: "",
        last_name: "",
        profile_id: 1,
        profile_image:
          "https://res.cloudinary.com/ds5rjhhxu/image/upload/v1/media/images/Dajana_Sommer_dvros3",
      })
    );
  }),
  rest.post(`${baseUrl}dj-rest-auth/logout/`, (req, res, ctx) => {
    return res(ctx.status(200));
  }),
];
