import { Checkbox } from '@/components/commons/Checkbox';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from 'react';
import { expect, vi } from 'vitest';

describe('Checkbox Component', () => {
    const onCheckedHandle = vi.fn();
    test('render with label', () => {
        render(<Checkbox checked={false} labelText="test" onCheckedChange={onCheckedHandle} />);

        expect(screen.getByText('test')).toBeInTheDocument();
        expect(screen.getByRole('checkbox')).toBeInTheDocument();
    });

    test('calls onCheckedChange and checked when clicked', async () => {
        render(<Checkbox checked={false} labelText="test" onCheckedChange={onCheckedHandle} />);
        const user = userEvent;

        const checkbox = screen.getByRole('checkbox');
        act(() => {
            user.click(checkbox);
        });
        expect(checkbox).toBeChecked();
        expect(onCheckedHandle).toHaveBeenCalledWith(true);
    });
    test('calls onCheckedChange and checked when label is clicked', async () => {
        render(<Checkbox checked={false} labelText="test" onCheckedChange={onCheckedHandle} />);
        const user = userEvent;
        const checkbox = screen.getByRole('checkbox');
        const label = screen.getByText('test');

        expect(checkbox).not.toBeChecked();
        expect(label).toBeInTheDocument();

        act(() => {
            user.click(label);
        });
        expect(checkbox).toBeChecked();
        expect(onCheckedHandle).toHaveBeenCalledWith(true);
    });

    test('has the correct classes and properties', () => {
        render(
            <Checkbox checked={false} labelText="test" onCheckedChange={onCheckedHandle} className="custom-class" />
        );

        // eslint-disable-next-line testing-library/no-node-access
        const checkBoxContainer = screen.getByRole('checkbox').parentElement;
        expect(checkBoxContainer).toHaveClass('custom-class');
        expect(screen.getByRole('checkbox')).toHaveClass('size-5 shrink-0 rounded-full ring-offset-white');
    });

    test('checked color is primary and unChecked color is secondary', () => {
        render(
            <>
                <Checkbox checked={true} onCheckedChange={onCheckedHandle} testId={'checked'} />
                <Checkbox checked={false} onCheckedChange={onCheckedHandle} testId={'unChecked'} />
            </>
        );

        const checkedIcon = screen.getByTestId('check-icon-checked');
        const unCheckedIcon = screen.getByTestId('check-icon-unChecked');

        expect(checkedIcon).toHaveClass('fill-primary');
        expect(unCheckedIcon).toHaveClass('fill-fill-disabled');
    });
});
