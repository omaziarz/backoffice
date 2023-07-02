import { ApplicationPicker } from '@/components/dashboard/ApplicationPicker';
import { HeatMapIframe } from '@/components/dashboard/HeatmapIframe';
import {
  Application,
  getAllUserApplications,
  getFirstUserApplication,
} from '@/data/applications';
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

  const applicationId = Array.isArray(context.params?.applicationId)
    ? context.params?.applicationId[0]
    : context.params?.applicationId;

  if (!applicationId) {
    const firstApplication = await getFirstUserApplication(
      session.user.accessToken
    );

    if (!firstApplication) {
      return {
        redirect: {
          destination: '/applications',
          permanent: false,
        },
      };
    }

    return {
      redirect: {
        destination: `/dashboard/${firstApplication.id}`,
        permanent: false,
      },
    };
  }

  const applications = await getAllUserApplications(session.user.accessToken);

  if (!applications || applications.length === 0) {
    return {
      redirect: {
        destination: '/404',
        permanent: false,
      },
    };
  }

  const application = applications.find((app) => app.id === applicationId);

  if (!application) {
    return {
      redirect: {
        destination: '/404',
        permanent: false,
      },
    };
  }

  return {
    props: {
      session,
      application,
      applicationsList: applications,
    },
  };
};

interface Props {
  session: Session;
  application: Application;
  applicationsList: Application[];
}

export default function Dashboard({
  session,
  application,
  applicationsList,
}: Props) {
  // check application.origin is a valid url
  try {
    new URL(application.origin);
  } catch (e) {
    return (
      <>
        <ApplicationPicker
          defaultApplicationId={application.id}
          applications={applicationsList}
        />
        <p>
          The following origin :{' '}
          <span className="text-slate-200 italic">{application.origin}</span> is
          invalid. Please edit your application and provide a valid origin.
        </p>
      </>
    );
  }

  return (
    <>
      <pre>{JSON.stringify(application)}</pre>
      <ApplicationPicker
        defaultApplicationId={application.id}
        applications={applicationsList}
      />
      <HeatMapIframe
        application={application}
        accessToken={session.user.accessToken}
      />
    </>
  );
}
