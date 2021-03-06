import {NextApiRequest, NextApiResponse} from "next";
import {Project} from "@/database/models/Project";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  try {
    const {method, query, cookies} = await req;

    const hasAuthCookie = "CRM_USER" in cookies;

    if (!hasAuthCookie) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized request.",
      });
    }

    const cookieBody = JSON.parse(cookies.CRM_USER);
    const id = parseInt(query.id.toString(), 10);
    const projects = <Array<Project>>await Project.where({user_id: id});

    if (cookieBody.role === "Manager" || cookieBody.role === "Employee") {
      return res.status(200).json({success: true, data: projects});
    }

    res.status(401).json({
      success: false,
      message: "You cannot access this endpoint.",
    });
  } catch (e) {
    return res.status(503).json({
      success: false,
      message: "Internal error.",
    });
  }
}
