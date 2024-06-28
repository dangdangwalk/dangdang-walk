export const DogRegHeader = ({ children }: { children: React.ReactNode }) => {
    return <div>{children}</div>;
};

const Section1 = ({ children }: { children: React.ReactNode }) => {
    return <span className="text-xl font-semibold leading-[30px] text-amber-500">{children}</span>;
};
const Section2 = ({ children }: { children: React.ReactNode }) => {
    return <span className="text-xl font-semibold leading-[30px] text-neutral-800">{children}</span>;
};

DogRegHeader.Section1 = Section1;
DogRegHeader.Section2 = Section2;
