const { v4: uuid } = require("uuid");
const mime = require("mime-types");
const multiparty = require("multiparty");

module.exports = ({ prisma, s3 }) => (req, res) => {
  let form = new multiparty.Form();

  form.on("part", async function(part) {
    if (part.name !== "file") {
      return;
    }

    const name = part.filename;
    const secret = uuid();
    const size = part.byteCount;
    const type = mime.lookup(part.filename);

    try {
      const response = await s3
        .upload({
          Key: secret,
          ACL: "public-read",
          Body: part,
          ContentLength: size,
          ContentType: type
        })
        .promise();

      const url = response.Location;

      const data = {
        name,
        size,
        secret,
        type,
        url
      };

      const { id } = await prisma.mutation.createFile({ data }, ` { id } `);

      const file = {
        id,
        name,
        secret,
        type,
        size,
        url
      };

      return res.status(200).send(file);
    } catch (err) {
      console.log(err);
      return res.sendStatus(500);
    }
  });

  form.on("error", err => {
    console.log("err", err);

    return res.sendStatus(500);
  });

  form.parse(req);
};
