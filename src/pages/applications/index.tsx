import { CreateApplication } from '@/components/applications/CreateApplication';
import { Application, getAllUserApplications } from '@/data/applications';
import { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth';
import { Session, authOptions } from '../api/auth/[...nextauth]';

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = (await getServerSession(
    context.req,
    context.res,
    authOptions
  )) as Session | null;
  if (!session) {
    return {
      redirect: {
        destination: '/api/auth/signin?callbackUrl=/applications',
        permanent: false,
      },
    };
  }

  const applications = await getAllUserApplications(session.user.accessToken);

  return {
    props: {
      session,
      applications,
    },
  };
};

interface Props {
  session: Session;
  applications: Application[];
}

export default function Applications({ session, applications }: Props) {
  if (!applications || applications.length === 0) {
    return (
      <>
        <div className="card bg-base-200">
          <div className="card-body">
            <h2 className="card-title">Applications</h2>
            <p>You currently dont have any applications.</p>
          </div>
        </div>

        <div className="divider"></div>

        <CreateApplication accessToken={session.user.accessToken} />
      </>
    );
  }

  return (
    <>
      <div className="">
        <div className="card-body">
          <h2 className="card-title">Applications</h2>
          <p>You currently have {applications.length} application.</p>
        </div>
      </div>

      <div className="divider"></div>

      <CreateApplication accessToken={session.user.accessToken} />

      <div className="divider"></div>

      <div className="grid grid-cols-1 gap-4">
        {applications.map((application) => (
          <div className="card card-compact bg-base-200" key={application.id}>
            <div className="card-body rounded-sm">
              <h2 className="card-title">{application.name}</h2>
              <p className="italic text-slate-200">{application.origin}</p>
            </div>
            <div className="border-base-100 border-t-2 flex flex-col p-2 gap-1 px-3">
              <p>App Id : {application.id}</p>
              <p>App Secret : {application.secret}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
