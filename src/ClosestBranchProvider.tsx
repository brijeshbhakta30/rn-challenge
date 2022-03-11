import { FC, ReactNode, createContext, useContext, useEffect, useMemo, useState } from 'react';
import { Branch } from './Branch';
import { SearchLocation } from './SearchLocation';
import { closestBranchTo } from './distances';
import useLoading, { States } from './useLoading';

export interface ClosestBranchContextData {
  closestBranch?: Branch | undefined;
  search?: SearchLocation | undefined;
}

export interface ClosestBranchContextType extends ClosestBranchContextData {
  state: States;
  branches: Branch[] | undefined;
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
 * ClosestBranchProvider
 */
export const ClosestBranchProvider: FC<ClosestBranchProviderProps> = (props) => {
  const { children, loading = null } = props;
  const [state, branches] = useLoading();
  const [data, setData] = useState<ClosestBranchContextData>({});

  const setClosestBranch = async (closestBranch?: ClosestBranchContextType['closestBranch']) => {
    setData({ ...data, closestBranch });
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
      setClosestBranch(closestBranchTo(data.search, branches));
    } else {
      setClosestBranch(undefined);
    }
  }, [data?.search, branches]);

  return (
    <ClosestBranchContext.Provider value={value}>
      {loading || (typeof children === 'function' ? children(value) : children)}
    </ClosestBranchContext.Provider>
  );
};
