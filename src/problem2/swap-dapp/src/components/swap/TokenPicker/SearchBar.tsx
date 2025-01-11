import { Input } from "@/components/ui/input";
import Image from "next/image";
import { networks } from "@/data/networks";

const SearchWithNetwork = ({
  searchTerm,
  setSearchTerm,
  network,
  setNetwork,
}: {
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  network: string;
  setNetwork: React.Dispatch<React.SetStateAction<string>>;
}) => {
  return (
    <div className="my-4 flex items-center gap-2">
      {/* Network Dropdown */}
      <div className="flex items-center relative">
        {/* Network Icon */}
        <Image
          src={
            networks.find((n) => n.id === network)?.icon ||
            "/assets/tokens/all-networks.svg"
          }
          alt={network}
          width={20}
          height={20}
          className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full"
        />

        {/* Network Dropdown */}
        <select
          value={network}
          onChange={(e) => setNetwork(e.target.value)}
          className="appearance-none pl-10 pr-3 py-2 rounded-lg focus:outline-none"
        >
          {networks.map((n) => (
            <option key={n.id} value={n.id}>
              {n.name}
            </option>
          ))}
        </select>
      </div>

      {/* Search Input */}
      <Input
        type="text"
        placeholder="Search tokens"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="flex-1"
      />
    </div>
  );
};

export default SearchWithNetwork;
