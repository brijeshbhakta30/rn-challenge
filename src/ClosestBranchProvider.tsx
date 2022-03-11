import { FC, ReactNode, createContext, useContext, useEffect, useMemo, useState } from 'react';
import { Branch } from './Branch';
import { SearchLocation } from './SearchLocation';
import { closestBranchTo, getNearestBranches } from './distances';
import useLoading, { States } from './useLoading';

export interface ClosestBranchContextData {
  closestBranch?: Branch;
  search?: SearchLocation;
  nearByBranches?: Branch[];
}

export interface ClosestBranchContextType extends ClosestBranchContextData {
  state: States;
  branches?: Branch[];
  actions: {
    setClosestBranch: (branch: Branch) => void;
    setSearch: (search: SearchLocation) => void;
  };
}

type ClosestBranchProviderProps = {
  value?: ClosestBranchContextType;
  children?: ReactNode | ((data: ClosestBranchContextType) => ReactNode);
  loading?: ReactNode;
};

/*
  Closest Branch Context
*/
export const ClosestBranchContext = createContext({} as ClosestBranchContextType);

/**
 * useClosestBranch hook to use it in function component
 * @returns closest branch details
 */
export const useClosestBranch = (): ClosestBranchContextType['closestBranch'] => {
  const closestBranchData = useContext(ClosestBranchContext);
  if (closestBranchData === undefined) {
    throw new Error(
      'useClosestBranch must be used within a component wrapped with ClosestBranchProvider'
    );
  }

  return closestBranchData.closestBranch;
};

/**
 * useNearByBranches hook to use it in function component
 * @returns Near by branches details
 */
 export const useNearByBranches = (): ClosestBranchContextType['nearByBranches'] => {
  const closestBranchData = useContext(ClosestBranchContext);
  if (closestBranchData === undefined) {
    throw new Error(
      'useNearByBranches must be used within a component wrapped with ClosestBranchProvider'
    );
  }

  return closestBranchData.nearByBranches;
};

 /**
 * ClosestBranchProvider
 */
export const ClosestBranchProvider: FC<ClosestBranchProviderProps> = (props) => {
  const { children, loading = null } = props;
  const [state, branches] = useLoading();
  const [data, setData] = useState<ClosestBranchContextData>({});

  const setClosestBranch = async (closestBranch?: ClosestBranchContextType['closestBranch']) => {
    setData({ ...data, closestBranch });
  };

  const setNearByBranches = async (nearByBranches?: ClosestBranchContextType['nearByBranches']) => {
    setData({ ...data, nearByBranches });
  };

  const setSearch = async (search?: ClosestBranchContextType['search']) => {
    setData({ ...data, search });
  };

  const value = useMemo(() => {
    const newValue: ClosestBranchContextType = {
      ...data,
      state,
      branches,
      actions: { setClosestBranch, setSearch },
    };
    return newValue;
  }, [data]);

  useEffect(() => {
    if (branches && typeof data?.search === 'object') {
      setClosestBranch(closestBranchTo(data.search, branches) as Branch);
      setNearByBranches(getNearestBranches(data.search, branches) as Branch[]);
    } else {
      setClosestBranch(undefined);
      setNearByBranches(undefined);
    }
  }, [data?.search, branches]);

  return (
    <ClosestBranchContext.Provider value={value}>
      {loading || (typeof children === 'function' ? children(value) : children)}
    </ClosestBranchContext.Provider>
  );
};
