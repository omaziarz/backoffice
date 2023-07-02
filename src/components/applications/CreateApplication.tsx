'use client';

import { useCreateApplicationMutation } from '@/data/applicationsHooks';
import { Formik, FormikHelpers } from 'formik';
import { object, string } from 'yup';

interface Props {
  accessToken: string;
}

const schema = object().shape({
  name: string().required().min(2).max(50),
  origin: string().required().min(2).max(255),
});

export function CreateApplication(props: Props) {
  const mutation = useCreateApplicationMutation();

  async function handleSubmit(
    values: { name: string; origin: string },
    { resetForm }: FormikHelpers<{ name: string; origin: string }>
  ) {
    await mutation.mutateAsync({
      accessToken: props.accessToken,
      ...values,
    });

    if (mutation.error === null) {
      resetForm();
    }
  }

  return (
    <Formik
      validationSchema={schema}
      validateOnBlur={true}
      initialValues={{ name: '', origin: '' }}
      onSubmit={handleSubmit}
    >
      {({ handleBlur, handleChange, handleSubmit, values, errors }) => (
        <>
          <form onSubmit={handleSubmit} className="flex flex-col gap-2">
            {mutation.error !== null && (
              <p className="text-error">{mutation.error?.message}</p>
            )}
            {Object.values(errors).length > 0 && (
              <div className="flex flex-col p-2 gap-1">
                {Object.entries(errors).map(([key, value]) => (
                  <p className="text-error" key={key}>
                    {value}
                  </p>
                ))}
              </div>
            )}

            <div className="flex gap-2">
              <input
                name="name"
                type="text"
                placeholder="name"
                className="input w-full max-w-xs bg-base-200"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.name}
              />
              <input
                name="origin"
                type="text"
                placeholder="origin"
                className="input w-full max-w-xs bg-base-200"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.origin}
              />
              <button
                className="btn"
                type="submit"
                disabled={mutation.isLoading}
              >
                Create
              </button>
            </div>
          </form>
        </>
      )}
    </Formik>
  );
}
