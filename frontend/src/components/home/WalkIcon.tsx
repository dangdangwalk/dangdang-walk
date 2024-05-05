import Group from '@/assets/icons/walk/group.svg';
import Ellipse from '@/assets/icons/walk/ellipse-107.svg';

export default function WalkIcon() {
    return (
        <div className="relative flex justify-center items-center">
            <img src={Ellipse} alt="eliipse" />
            <img className="absolute" src={Group} alt="walk" />
        </div>
    );
}
