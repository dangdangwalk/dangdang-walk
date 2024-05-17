import { queryStringKeys } from '@/constants';
import { useSearchParams } from 'react-router-dom';

export default function Journals() {
    const [searchParams, setSearchParams] = useSearchParams();
    console.log(searchParams.get(queryStringKeys.DOGID));

    return <div>Journals</div>;
}
