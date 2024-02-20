'use server';

import { GraphQLClientSingleton } from 'app/graphql';
import { createUserMutation } from 'app/graphql/mutations/createUserMutation';
import { createAccessToken } from 'app/utils/auth/createAccessToken';
import { redirect } from 'next/navigation';

export const handleCreateUser = async (formData: FormData) => {
  const formDataObject = Object.fromEntries(formData);
  delete formDataObject['password_confirmation'];
  const graphqlClient = GraphQLClientSingleton.getInstance().getClient();
  const varialbles = {
    input: {
      ...formDataObject,
      phone: '+58' + formDataObject.phone,
    },
  };
  const { customerCreate }: any = await graphqlClient.request(
    createUserMutation,
    varialbles
  );
  const { customer } = customerCreate;
  if (customer?.firtsName) {
    await createAccessToken(
      formDataObject.email as string,
      formDataObject.password as string
    );
    redirect('/store');
  }
};

export const hanldeLogin = async (formData: FormData) => {
  const formDataObject = Object.fromEntries(formData);
  const accessToken = await createAccessToken(
    formDataObject.email as string,
    formDataObject.password as string
  );
  if (accessToken) {
    redirect('store');
  }
};