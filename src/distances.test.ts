import * as Location from 'expo-location';
import { closestBranchTo, getNearestBranches } from './distances';
import { Branch } from './Branch';

const location: Location.LocationGeocodedLocation = {
  latitude: 51.52578,
  longitude: -0.14051,
};

const branch1: Branch = {
  Identification: 'Branch1',
  SequenceNumber: '1',
  Type: 'Physical',
  CustomerSegment: ['Personal'],
  PostalAddress: {
    PostCode: 'MK5 6LA',
    GeoLocation: {
      GeographicCoordinates: {
        Latitude: '52.018181',
        Longitude: '-0.79136',
      },
    },
  },
};

const branch2: Branch = {
  Identification: 'Branch2',
  SequenceNumber: '2',
  Type: 'Physical',
  CustomerSegment: ['Corporate'],
  PostalAddress: {
    PostCode: '28660 Boadilla del Monte',
    GeoLocation: {
      GeographicCoordinates: {
        Latitude: '40.393318',
        Longitude: '-3.859050',
      },
    },
  },
};

const branch3: Branch = {
  Identification: 'Branch3',
  SequenceNumber: '3',
  Type: 'Physical',
  CustomerSegment: ['Corporate'],
  PostalAddress: {
    PostCode: '28660 LYNEHAM',
    GeoLocation: {
      GeographicCoordinates: {
        Latitude: '41.393318',
        Longitude: '-3.959050',
      },
    },
  },
};

describe('closestBranchTo', () => {
  it('should return undefined for no branches', () => {
    expect(closestBranchTo(location, [])).toBeUndefined();
  });

  it('should return a single branch', () => {
    expect(closestBranchTo(location, [branch1])).toBe(branch1);
  });

  it('should return the closest branch', () => {
    expect(closestBranchTo(location, [branch2, branch1])).toBe(branch1);
  });

  it('should return the closest branches in assending order of distance', () => {    
    expect(closestBranchTo(location, [branch2, branch1, branch3], true)).toStrictEqual([branch1, branch3, branch2]);
  });

});

describe('getNearestBranches', () => {

  it('should return empty array for no branches', () => {
    expect(getNearestBranches(location, [])).toStrictEqual([]);
  });

  it('should return a single closest branch in array', () => {
    expect(getNearestBranches(location, [branch1, branch3], 1)).toStrictEqual([branch1]);
  });

  it('should return the nearBy branches in order', () => {
    expect(getNearestBranches(location, [branch2, branch1, branch3])).toStrictEqual([branch1, branch3, branch2]);
  });
});
