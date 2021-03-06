import {NextApiRequest, NextApiResponse} from "next";
import {Project} from "@/database/models/Project";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  try {
    const {method, body, cookies} = await req;

    const hasAuthCookie = "CRM_USER" in cookies;

    if (!hasAuthCookie) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized request.",
      });
    }

    const cookieBody = JSON.parse(cookies.CRM_USER);

    if (method === "POST") {
      const project = new Project();
      project.name = body.name;
      project.price = body.price;
      project.deadline = body.deadline;
      project.is_accepted = false;
      project.is_completed = false;
      project.is_payed = false;
      project.user_id = cookieBody.id;
      const result = await project.save();
      return res.status(200).json({
        success: true,
        message: "Created new Project.",
        result,
      });
    }

    const projects = <Array<Project>>await Project.all();

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
