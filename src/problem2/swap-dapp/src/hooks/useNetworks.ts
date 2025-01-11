import { networks } from "@/data/networks";

export interface Network {
  id: string;
  name: string;
  icon: string;
}

export const useNetworks = () => {
  const getAllNetworks = () => networks;

  const getNetworkById = (id: string): Network | undefined => {
    return networks.find((n) => n.id === id);
  };

  return {
    getAllNetworks,
    getNetworkById,
  };
};
