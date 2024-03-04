import { googleApiKey } from "@/constants";
import { Skeleton } from "@/lib/shadcn/components/ui/skeleton";
import { LocationEvent } from "@/sharedTypes";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";

type GooglePlacesAutocompleteInputProps = {
  isGoogleMapsLoaded: boolean;
  autocompleteType: "source" | "destination";
  autocompleteValue: any;
  placeholder: string;
  isDisabled: boolean;
  leftIcon: React.ReactNode;
  onChangeLocationCords: (event: LocationEvent, type: string) => void;
};

export const GooglePlacesAutocompleteInput = ({
  isGoogleMapsLoaded,
  autocompleteType,
  autocompleteValue,
  placeholder,
  isDisabled,
  leftIcon,
  onChangeLocationCords,
}: GooglePlacesAutocompleteInputProps) => {
  return (
    <div className="relative border rounded-md bg-zinc-100">
      <div className="absolute top-3 left-2 z-[1]">{leftIcon}</div>
      {isGoogleMapsLoaded ? (
        <GooglePlacesAutocomplete
          apiKey={googleApiKey}
          selectProps={{
            value: autocompleteValue,
            onChange: (event) => onChangeLocationCords(event, autocompleteType),
            placeholder,
            isClearable: true,
            isDisabled,
            components: {
              DropdownIndicator: null,
            },
            styles: {
              control: () => ({
                display: "flex",
                border: "none",
                paddingLeft: "24px",
                height: "40px",
              }),
            },
          }}
        />
      ) : (
        <Skeleton className="h-[40px] w-full" />
      )}
    </div>
  );
};
