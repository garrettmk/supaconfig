import { UseMutationOptions, useMutation, useQueryClient } from "@tanstack/react-query";
import { DeleteLocationInput, DeleteLocationResult, UpdateLocationInput, UpdateLocationResult, deleteLocation, updateLocation } from "./actions";
import { useEventsQuery } from "../events/queries";

export type UseLocationUpdateMutationInput = Omit<UseMutationOptions<UpdateLocationResult, Error, UpdateLocationInput>, 'mutationFn'>;

export function useLocationEditMutation(input?: UseLocationUpdateMutationInput) {
  const { onSuccess, ...useMutationOptions } = input ?? {};
  const queryClient = useQueryClient();
  const useMutationReturnValue = useMutation({
    mutationFn: updateLocation,
    onSuccess: (result, variables, context) => {
      useEventsQuery.invalidate(queryClient, variables.id);
      onSuccess?.(result, variables, context);
    },
    ...useMutationOptions
  });

  const mutate = (variables: UpdateLocationInput) => {
    useMutationReturnValue.mutate(variables);
  };

  return {
    ...useMutationReturnValue,
    mutate,
  };
}


export type UseLocationDeleteMutationInput = Omit<UseMutationOptions<DeleteLocationResult, Error, DeleteLocationInput>, 'mutationFn'>;

export function useLocationDeleteMutation(input?: UseLocationDeleteMutationInput) {
  const { onSuccess, ...useMutationOptions } = input ?? {};
  const queryClient = useQueryClient();
  const useMutationReturnValue = useMutation({
    mutationFn: deleteLocation,
    onSuccess: (result, variables, context) => {
      useEventsQuery.invalidate(queryClient, variables.id);
      onSuccess?.(result, variables, context);
    },
    ...useMutationOptions
  });

  const mutate = (variables: DeleteLocationInput) => {
    useMutationReturnValue.mutate(variables);
  };

  return {
    ...useMutationReturnValue,
    mutate,
  };
}