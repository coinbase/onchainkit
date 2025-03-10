'use client';

import { IdentityCard } from '@coinbase/onchainkit/identity';
import { base, mainnet } from 'viem/chains';
import { useAccount } from 'wagmi';
import { useNames, getNames, useAvatars, getAvatars } from '@coinbase/onchainkit/identity';
import { useState, useEffect } from 'react';
import { useOnchainKit, setOnchainKitConfig } from '@coinbase/onchainkit';

// Component for useNames resolution - only shows name/address text
function NameItem({ address, nameIndex, names }: { address: `0x${string}`, nameIndex: number, names: (string | null)[] | undefined }) {
  return (
    <li className="text-sm truncate">
      {!names ? 'Loading...' : (names[nameIndex] || `${address.substring(0, 6)}...${address.substring(38)}`)}
    </li>
  );
}

// Component for useAvatars resolution - shows avatar image + address
function AvatarItem({ address, nameIndex, names, avatars }: { 
  address: `0x${string}`, 
  nameIndex: number, 
  names: (string | null)[] | undefined,
  avatars: (string | null)[] | undefined
}) {
  const name = names ? names[nameIndex] : null;
  const avatar = avatars && name ? avatars[nameIndex] : null;
  
  return (
    <li className="text-sm truncate flex items-center gap-2">
      {!names || !avatars ? (
        'Loading...'
      ) : (
        <>
          {avatar && <img src={avatar} alt="Avatar" className="w-5 h-5 rounded-full" />}
          {name || `${address.substring(0, 6)}...${address.substring(38)}`}
        </>
      )}
    </li>
  );
}

// Component for getNames resolution - only shows name/address text
function GetNameItem({ address, nameIndex, names, isLoading }: { 
  address: `0x${string}`, 
  nameIndex: number, 
  names: (string | null)[], 
  isLoading: boolean 
}) {
  return (
    <li className="text-sm truncate">
      {isLoading ? 'Loading...' : names[nameIndex] || `${address.substring(0, 6)}...${address.substring(38)}`}
    </li>
  );
}

// Component for getAvatars resolution - shows avatar image + address
function GetAvatarItem({ address, nameIndex, names, avatars, isLoading }: { 
  address: `0x${string}`, 
  nameIndex: number, 
  names: (string | null)[], 
  avatars: (string | null)[],
  isLoading: boolean 
}) {
  return (
    <li className="text-sm truncate flex items-center gap-2">
      {isLoading ? (
        'Loading...'
      ) : (
        <>
          {avatars[nameIndex] && <img src={avatars[nameIndex] || ''} alt="Avatar" className="w-5 h-5 rounded-full" />}
          {names[nameIndex] || `${address.substring(0, 6)}...${address.substring(38)}`}
        </>
      )}
    </li>
  );
}

export function IdentityCardDemo() {
  const { address } = useAccount();
  const [addresses, setAddresses] = useState<string[]>([]);
  
  // For getNames and getAvatars
  const [batchNames, setBatchNames] = useState<(string | null)[]>([]);
  const [batchAvatars, setBatchAvatars] = useState<(string | null)[]>([]);
  const [isLoadingNames, setIsLoadingNames] = useState(true);
  const [isLoadingAvatars, setIsLoadingAvatars] = useState(true);
  
  const { apiKey, chain } = useOnchainKit();
  
  // For useNames and useAvatars
  const { data: hookNames, isLoading: isLoadingHookNames } = useNames({ 
    addresses: addresses as `0x${string}`[],
    chain: mainnet
  });
  
  const { data: hookAvatars, isLoading: isLoadingHookAvatars } = useAvatars({
    ensNames: hookNames?.filter(Boolean) as string[] || [],
    chain: mainnet
  });
  
  // Generate addresses with the first one fixed and the rest random
  useEffect(() => {
    const generateAddresses = () => {
      // Start with the specific address
      const result: string[] = ['0x4bEf0221d6F7Dd0C969fe46a4e9b339a84F52FDF'];
      
      // Add the specified second address
      result.push('0x849151d7D0bF1F34b70d5caD5149D28CC2308bf1');
      
      // Add 3 more random addresses (for a total of 5)
      for (let i = 0; i < 3; i++) {
        // Create variation in the last 4 characters of the address
        const hexIndex = i.toString(16).padStart(4, '0');
        result.push(`0x4bEf0221d6F7Dd0C969fe46a4e9b339a84F5${hexIndex}`);
      }
      setAddresses(result);
    };
    
    generateAddresses();
  }, []);
  
  // Fetch names and avatars using getNames and getAvatars
  useEffect(() => {
    const fetchData = async () => {
      if (!addresses.length || !apiKey) return;
      
      try {
        setIsLoadingNames(true);
        
        // Set the OnchainKit config before making the call
        setOnchainKitConfig({
          apiKey,
          chain,
        });
        
        // Get names for all addresses in a batch
        const nameResults = await getNames({ 
          addresses: addresses as `0x${string}`[], 
          chain: mainnet 
        });
        
        setBatchNames(nameResults);
        setIsLoadingNames(false);
        
        // Get avatars for all names in a batch
        setIsLoadingAvatars(true);
        const validNames = nameResults.filter(Boolean) as string[];
        
        if (validNames.length > 0) {
          const avatarResults = await getAvatars({ 
            ensNames: validNames, 
            chain: mainnet 
          });
          
          // Create a mapping of names to avatars
          const avatarMap = new Map<string, string | null>();
          validNames.forEach((name, idx) => {
            avatarMap.set(name, avatarResults[idx]);
          });
          
          // Map avatars back to the original address order
          const mappedAvatars = nameResults.map(name => 
            name ? avatarMap.get(name) || null : null
          );
          
          setBatchAvatars(mappedAvatars);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoadingAvatars(false);
      }
    };
    
    fetchData();
  }, [addresses, apiKey, chain]);

  if (!address) {
    return null;
  }

  return (
    <div className="mx-auto max-w-full p-4">
      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-4 gap-4">
          {/* useNames List */}
          <div className="space-y-2">
            <h2 className="font-medium text-gray-500 text-sm">useNames</h2>
            <div className="max-h-96 overflow-y-auto border rounded p-2">
              <ul className="list-disc pl-5 space-y-1">
                {addresses.map((addr, index) => (
                  <NameItem 
                    key={index} 
                    address={addr as `0x${string}`} 
                    nameIndex={index}
                    names={hookNames}
                  />
                ))}
              </ul>
            </div>
          </div>
          
          {/* getNames List */}
          <div className="space-y-2">
            <h2 className="font-medium text-gray-500 text-sm">getNames</h2>
            <div className="max-h-96 overflow-y-auto border rounded p-2">
              <ul className="list-disc pl-5 space-y-1">
                {addresses.map((addr, index) => (
                  <GetNameItem 
                    key={index} 
                    address={addr as `0x${string}`} 
                    nameIndex={index}
                    names={batchNames}
                    isLoading={isLoadingNames}
                  />
                ))}
              </ul>
            </div>
          </div>
          
          {/* useAvatars List */}
          <div className="space-y-2">
            <h2 className="font-medium text-gray-500 text-sm">useAvatars</h2>
            <div className="max-h-96 overflow-y-auto border rounded p-2">
              <ul className="list-disc pl-5 space-y-1">
                {addresses.map((addr, index) => (
                  <AvatarItem 
                    key={index} 
                    address={addr as `0x${string}`} 
                    nameIndex={index}
                    names={hookNames}
                    avatars={hookAvatars}
                  />
                ))}
              </ul>
            </div>
          </div>
          
          {/* getAvatars List */}
          <div className="space-y-2">
            <h2 className="font-medium text-gray-500 text-sm">getAvatars</h2>
            <div className="max-h-96 overflow-y-auto border rounded p-2">
              <ul className="list-disc pl-5 space-y-1">
                {addresses.map((addr, index) => (
                  <GetAvatarItem 
                    key={index} 
                    address={addr as `0x${string}`} 
                    nameIndex={index}
                    names={batchNames}
                    avatars={batchAvatars}
                    isLoading={isLoadingNames || isLoadingAvatars}
                  />
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
