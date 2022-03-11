import { useEffect, useRef } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import { Branch, branchAddress } from './Branch';
import { useClosestBranch, useNearByBranches } from './ClosestBranchProvider';

function MapMarker({ branch }: { branch: Branch }) {
  return (branch && branch.PostalAddress.GeoLocation ?
    <Marker
      identifier={branch.Identification}
      key={branch.Identification}
      title={branch.Name}
      description={branchAddress(branch)}
      coordinate={{
        latitude: parseFloat(
          branch.PostalAddress.GeoLocation.GeographicCoordinates
            .Latitude,
        ),
        longitude: parseFloat(
          branch.PostalAddress.GeoLocation.GeographicCoordinates
            .Longitude,
        ),
      }}>
      <Callout tooltip>
        <View style={styles.callout}>
          <Text style={styles.calloutHeader}>
            {branch.Name || branch.Identification}
          </Text>
          <Text style={styles.calloutText}>{branchAddress(branch)}</Text>
        </View>
      </Callout>
    </Marker>
  : null);
}

export default function Map() {
  const mapRef = useRef<MapView | null>(null);
  const closest = useClosestBranch();
  const nearByBranches = useNearByBranches();

  const renderMarker = (branch: Branch) => {
    return <MapMarker key={branch.Identification} branch={branch} />;
  }

  useEffect(() => {
    if (nearByBranches && mapRef) {
      
      const markerIds: string[] = nearByBranches.map(branch => branch.Identification);
      mapRef.current?.fitToSuppliedMarkers(markerIds);
    }
  }, [nearByBranches]);

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        ref={mapRef}
        maxZoomLevel={12}
        initialRegion={{
          latitude: 55.77,
          latitudeDelta: 11.03,
          longitude: -2.82,
          longitudeDelta: 11.35,
        }}>
        {closest && <MapMarker branch={closest} />}
        {nearByBranches && nearByBranches.length ? nearByBranches.map(renderMarker) : null}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: StyleSheet.absoluteFillObject,
  callout: {
    padding: 5,
    backgroundColor: '#ffffffa0',
    borderRadius: 4,
  },
  calloutHeader: {
    fontFamily: 'textBold',
    color: 'black',
    fontSize: 14,
  },
  calloutText: {
    fontFamily: 'textRegular',
    color: 'black',
    fontSize: 10,
  },
});
