import * as Location from 'expo-location';
import { Branch } from './Branch';

type Coordinate = {
  latitude: number;
  longitude: number;
};

// https://stackoverflow.com/a/65799152/5225716
function distanceBetween(coord1: Coordinate, coord2: Coordinate) {
  if (
    coord1.latitude == coord2.latitude &&
    coord1.longitude == coord2.longitude
  ) {
    return 0;
  }

  const radlat1 = (Math.PI * coord1.latitude) / 180;
  const radlat2 = (Math.PI * coord2.latitude) / 180;
  const theta = coord1.longitude - coord2.longitude;
  const radtheta = (Math.PI * theta) / 180;

  let dist =
    Math.sin(radlat1) * Math.sin(radlat2) +
    Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);

  if (dist > 1) {
    dist = 1;
  }

  dist = Math.acos(dist);
  dist = (dist * 180) / Math.PI;
  dist = dist * 60 * 1.1515;
  dist = dist * 1.609344; //convert miles to km

  return dist;
}

export function closestBranchTo(
  location: Location.LocationGeocodedLocation,
  branches: Branch[],
  list?: boolean,
): Branch | Branch[] | undefined {
  let closestBranch = undefined;
  let closestDistance = Number.MAX_VALUE;
  const branchesAndDistances: { branch: Branch | undefined, distance: number }[] = [];
  branches.forEach((branch) => {
    const { PostalAddress: { GeoLocation } } = branch;
    if (GeoLocation) {
      const distance = distanceBetween(location, {
        latitude: parseFloat(GeoLocation.GeographicCoordinates.Latitude),
        longitude: parseFloat(GeoLocation.GeographicCoordinates.Longitude),
      });
      if (list) {
        branchesAndDistances.push({ branch, distance });
      }
      if (distance < closestDistance) {
        closestBranch = branch;
        closestDistance = distance;
      }
    }
  });
  if (list) {
    return branchesAndDistances.sort((a, b) => a.distance - b.distance).map(({ branch }) => branch) as Branch[];
  }
  return closestBranch;
}

export function getNearestBranches(
  location: Location.LocationGeocodedLocation,
  branches: Branch[],
  recordsCount: number = 5,
) {
  const closestBranches = closestBranchTo(location, branches, true) as Branch[];
  return closestBranches.slice(0, recordsCount);
}