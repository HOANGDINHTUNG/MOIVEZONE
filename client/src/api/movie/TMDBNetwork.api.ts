import axiosTMDB from "../../app/axiosTMDB";
import type {
  TMDBNetworkAltNamesResponse,
  TMDBNetworkDetails,
  TMDBNetworkImagesResponse,
} from "../../module/networks/database/interface/network";

export const fetchNetworkDetails = async (
  networkId: number | string
): Promise<TMDBNetworkDetails> => {
  const res = await axiosTMDB.get<TMDBNetworkDetails>(`/network/${networkId}`);
  return res.data;
};

export const fetchNetworkAltNames = async (
  networkId: number | string
): Promise<TMDBNetworkAltNamesResponse> => {
  const res = await axiosTMDB.get<TMDBNetworkAltNamesResponse>(
    `/network/${networkId}/alternative_names`
  );
  return res.data;
};

export const fetchNetworkImages = async (
  networkId: number | string
): Promise<TMDBNetworkImagesResponse> => {
  const res = await axiosTMDB.get<TMDBNetworkImagesResponse>(
    `/network/${networkId}/images`
  );
  return res.data;
};
