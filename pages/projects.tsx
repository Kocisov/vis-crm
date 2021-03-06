import Link from "next/link";
import {AsideMenu} from "@/features/aside/AsideMenu";
import {useUser} from "@/features/hooks/useUser";
import {Page} from "@/features/page/Page";
import {useApiRequest} from "@/features/hooks/useApiRequest";
import {Project} from "@/database/models/Project";

export default function Projects() {
  const {user} = useUser({redirectTo: "/login"});
  const {data: projects} = useApiRequest("/api/projects/me");

  return (
    <Page loadUser={!user || !user.isLoggedIn}>
      <AsideMenu user={user} />
      <div className="p-2 overflow-auto max-h-full">
        <div className="flex items-center space-x-2">
          <div className="font-semibold text-lg">Moje projekty</div>
          <Link href="/add-project">
            <div className="bg-black text-white px-2 py-1 font-medium cursor-pointer">
              Zadat nový projekt
            </div>
          </Link>
        </div>
        {!projects ? (
          <div>Počkejte prosím, načítáme Vaše projekty.</div>
        ) : (
          <div className="flex flex-col items-start space-y-2">
            <div className="flex items-center font-semibold">
              <div className="w-10 text-center">#</div>
              <div className="text-center" style={{width: 340}}>
                Jméno
              </div>
              <div className="text-center" style={{width: 200}}>
                Cena
              </div>
              <div className="text-center" style={{width: 80}}>
                Potvrzeno
              </div>
              <div className="text-center" style={{width: 80}}>
                Zaplaceno
              </div>
              <div className="text-center" style={{width: 80}}>
                Hotovo
              </div>
              <div className="text-center" style={{width: 140}}>
                Datum zadání
              </div>
            </div>
            {projects?.map((project: Project, index: number) => (
              <Link href={`/projects/${project.id}`} key={project.id}>
                <div className="flex items-center cursor-pointer border py-2 hover:border-black">
                  <div className="w-10 text-center">{index + 1}</div>
                  <div style={{width: 340}}>{project.name}</div>
                  <div className="text-center" style={{width: 200}}>
                    {project.price}€
                  </div>
                  <div className="text-center" style={{width: 80}}>
                    {project.is_accepted ? "Ano" : "Ne"}
                  </div>
                  <div className="text-center" style={{width: 80}}>
                    {project.is_payed ? "Ano" : "Ne"}
                  </div>
                  <div className="text-center" style={{width: 80}}>
                    {project.is_completed ? "Ano" : "Ne"}
                  </div>
                  <div className="text-center" style={{width: 140}}>
                    {new Date(project.created_at).toLocaleDateString()}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </Page>
  );
}
