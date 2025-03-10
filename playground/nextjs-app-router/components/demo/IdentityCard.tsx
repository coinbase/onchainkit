'use client';

import { IdentityCard } from '@coinbase/onchainkit/identity';
import { base, mainnet } from 'viem/chains';
import { useAccount } from 'wagmi';
import { useName, getName, useAvatar, getAvatar } from '@coinbase/onchainkit/identity';
import { useState, useEffect } from 'react';
import { useOnchainKit, setOnchainKitConfig } from '@coinbase/onchainkit';

// Component for useName resolution - only shows name/address text
function NameItem({ address }: { address: `0x${string}` }) {
  const { data: name, isLoading } = useName({ address });
  return (
    <li className="text-sm truncate">
      {isLoading ? 'Loading...' : name || `${address.substring(0, 6)}...${address.substring(38)}`}
    </li>
  );
}

// Component for useAvatar resolution - shows avatar image + address
function AvatarItem({ address }: { address: `0x${string}` }) {
  // Get name first, then use it for avatar if available
  const { data: name } = useName({ address });
  const { data: avatar, isLoading } = useAvatar({ 
    ensName: name || undefined 
  });
  
  return (
    <li className="text-sm truncate flex items-center gap-2">
      {isLoading ? (
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

// Component for getName resolution - only shows name/address text
function GetNameItem({ address }: { address: `0x${string}` }) {
  const [name, setName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { apiKey, chain } = useOnchainKit();
  
  useEffect(() => {
    const fetchName = async () => {
      try {
        console.log(`Fetching name for address: ${address}, with API key: ${apiKey ? 'Available' : 'Not available'}`);
        
        // Set the OnchainKit config before making the call
        if (apiKey) {
          setOnchainKitConfig({
            apiKey,
            chain,
          });
        }
        
        // Explicitly specify the chain parameter (mainnet by default)
        const result = await getName({ address, chain: mainnet });
        console.log(`Name result for ${address}: ${result}`);
        setName(result);
      } catch (error) {
        console.error(`Error fetching name for ${address}:`, error);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (apiKey) {
      fetchName();
    } else {
      console.error('API key not available for getName');
      setIsLoading(false);
    }
  }, [address, apiKey, chain]);
  
  return (
    <li className="text-sm truncate">
      {isLoading ? 'Loading...' : name || `${address.substring(0, 6)}...${address.substring(38)}`}
    </li>
  );
}

// Component for getAvatar resolution - shows avatar image + address
function GetAvatarItem({ address }: { address: `0x${string}` }) {
  const [avatar, setAvatar] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { apiKey, chain } = useOnchainKit();
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log(`Fetching data for address: ${address}, with API key: ${apiKey ? 'Available' : 'Not available'}`);
        
        // Set the OnchainKit config before making the call
        if (apiKey) {
          setOnchainKitConfig({
            apiKey,
            chain,
          });
        }
        
        // First get the name with explicit chain parameter
        const nameResult = await getName({ address, chain: mainnet });
        console.log(`Name result for ${address}: ${nameResult}`);
        setName(nameResult);
        
        // Then use the name to get the avatar if available, with explicit chain parameter
        if (nameResult) {
          console.log(`Fetching avatar for name: ${nameResult}`);
          const avatarResult = await getAvatar({ ensName: nameResult, chain: mainnet });
          console.log(`Avatar result for ${nameResult}: ${avatarResult ? 'Found' : 'Not found'}`);
          setAvatar(avatarResult);
        } else {
          console.log(`No name found for ${address}, skipping avatar fetch`);
        }
      } catch (error) {
        console.error(`Error fetching data for ${address}:`, error);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (apiKey) {
      fetchData();
    } else {
      console.error('API key not available for getAvatar');
      setIsLoading(false);
    }
  }, [address, apiKey, chain]);
  
  return (
    <li className="text-sm truncate flex items-center gap-2">
      {isLoading ? (
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

export function IdentityCardDemo() {
  const { address } = useAccount();
  const [addresses, setAddresses] = useState<string[]>([]);
  
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

  if (!address) {
    return null;
  }

  return (
    <div className="mx-auto max-w-full p-4">
      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-4 gap-4">
          {/* useName List */}
          <div className="space-y-2">
            <h2 className="font-medium text-gray-500 text-sm">useName</h2>
            <div className="max-h-96 overflow-y-auto border rounded p-2">
              <ul className="list-disc pl-5 space-y-1">
                {addresses.map((addr, index) => (
                  <NameItem key={index} address={addr as `0x${string}`} />
                ))}
              </ul>
            </div>
          </div>
          
          {/* getName List */}
          <div className="space-y-2">
            <h2 className="font-medium text-gray-500 text-sm">getName</h2>
            <div className="max-h-96 overflow-y-auto border rounded p-2">
              <ul className="list-disc pl-5 space-y-1">
                {addresses.map((addr, index) => (
                  <GetNameItem key={index} address={addr as `0x${string}`} />
                ))}
              </ul>
            </div>
          </div>
          
          {/* useAvatar List */}
          <div className="space-y-2">
            <h2 className="font-medium text-gray-500 text-sm">useAvatar</h2>
            <div className="max-h-96 overflow-y-auto border rounded p-2">
              <ul className="list-disc pl-5 space-y-1">
                {addresses.map((addr, index) => (
                  <AvatarItem key={index} address={addr as `0x${string}`} />
                ))}
              </ul>
            </div>
          </div>
          
          {/* getAvatar List */}
          <div className="space-y-2">
            <h2 className="font-medium text-gray-500 text-sm">getAvatar</h2>
            <div className="max-h-96 overflow-y-auto border rounded p-2">
              <ul className="list-disc pl-5 space-y-1">
                {addresses.map((addr, index) => (
                  <GetAvatarItem key={index} address={addr as `0x${string}`} />
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
