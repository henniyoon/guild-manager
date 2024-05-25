import React, { useEffect, useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import koLocale from 'dayjs/locale/ko';
import updateLocale from 'dayjs/plugin/updateLocale';
import { styled } from '@mui/material/styles';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { PickersDay, PickersDayProps } from '@mui/x-date-pickers/PickersDay';
import { Button, Dialog, DialogTitle } from '@mui/material';
import CalendarMonthTwoToneIcon from '@mui/icons-material/CalendarMonthTwoTone';

dayjs.extend(weekOfYear);
dayjs.extend(updateLocale);
dayjs.updateLocale('ko', {
    // weekStart: 1,
});

interface CustomPickerDayProps extends PickersDayProps<Dayjs> {
    isSelected: boolean;
    isHovered: boolean;
}

const CustomPickersDay = styled(PickersDay, {
    shouldForwardProp: (prop) => prop !== 'isSelected' && prop !== 'isHovered',
})<CustomPickerDayProps>(({ theme, isSelected, isHovered, day }) => ({
    borderRadius: 0,
    ...(isSelected && {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
        '&:hover, &:focus': {
            backgroundColor: theme.palette.primary.main,
        },
    }),
    ...(isHovered && {
        backgroundColor: theme.palette.primary[theme.palette.mode],
        '&:hover, &:focus': {
            backgroundColor: theme.palette.primary[theme.palette.mode],
        },
    }),
    ...(day.day() === 4 && {
        borderTopLeftRadius: '50%',
        borderBottomLeftRadius: '50%',
    }),
    ...(day.day() === 3 && {
        borderTopRightRadius: '50%',
        borderBottomRightRadius: '50%',
    }),
})) as React.ComponentType<CustomPickerDayProps>;

const getCustomWeekNumber = (date: Dayjs) => {
    // 기준일을 목요일로 설정
    const baseDay = 4; // 목요일
    const dayOfWeek = date.day();
    const startOfWeek = dayOfWeek >= baseDay ? date : date.subtract(7, 'day');
    return startOfWeek.week();
};

const isInSameWeek = (dayA: Dayjs, dayB: Dayjs | null | undefined) => {
    if (dayB == null) {
        return false;
    }

    return getCustomWeekNumber(dayA) === getCustomWeekNumber(dayB);
};

function Day(
    props: PickersDayProps<Dayjs> & {
        selectedDay?: Dayjs | null;
        hoveredDay?: Dayjs | null;
        weekNumber?: number;
    },
) {
    const { day, selectedDay, hoveredDay, weekNumber, ...other } = props;

    return (
        <CustomPickersDay
            {...other}
            day={day}
            sx={{ px: 2.5 }}
            disableMargin
            isSelected={isInSameWeek(day, selectedDay)}
            isHovered={isInSameWeek(day, hoveredDay)}
        >
        </CustomPickersDay>
    );
}

interface WeekPickerProps {
    selectedDate: Dayjs | null;
    onDateChange: (newDate: Dayjs | null) => void;
}

const WeekPicker: React.FC<WeekPickerProps> = ({ selectedDate, onDateChange }) => {
    const [minDate, setMinDate] = useState(dayjs());
    const [maxDate, setMaxDate] = useState(dayjs());
    const [hoveredDay, setHoveredDay] = useState<Dayjs | null>(null);
    const [isCalendarOpen, setCalendarOpen] = useState(false);
    const [weekNumber, setWeekNumber] = useState(0);   

    useEffect(() => {
        if (selectedDate) {
            const week = getCustomWeekNumber(selectedDate);
            setWeekNumber(week);
        }
    }, [selectedDate]);

    useEffect(() => {
        const today = dayjs();
        const past28Days = today.subtract(28, 'day');
        const next7Days = today.add(7, 'day');

        setMinDate(past28Days);
        setMaxDate(next7Days);
    }, []);

    const openCalendar = () => {
        setCalendarOpen(true);
    };

    const closeCalendar = () => {
        setCalendarOpen(false);
    };

    return (
        <div style={{ marginLeft: '20px' }}>
            <Button variant='outlined' style={{ textAlign: 'center' }} onClick={openCalendar}>
                <CalendarMonthTwoToneIcon style={{ fontSize: '16px', marginRight: '5px' }}/>
                {dayjs(selectedDate).year()}년 {weekNumber}주차
            </Button>

            <Dialog open={isCalendarOpen} onClose={closeCalendar}>
                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={koLocale.name || 'ko'}>
                    <DateCalendar
                        value={selectedDate}
                        onChange={(newValue) => {
                            onDateChange(newValue);
                            closeCalendar();
                        }}
                        showDaysOutsideCurrentMonth
                        displayWeekNumber
                        slots={{ day: Day }}
                        slotProps={{
                            day: (ownerState: { day: Dayjs }) => ({
                                selectedDay: selectedDate,
                                hoveredDay,
                                weekNumber: getCustomWeekNumber(ownerState.day),
                                onPointerEnter: () => setHoveredDay(ownerState.day),
                                onPointerLeave: () => setHoveredDay(null),
                            }),
                        }}
                        maxDate={maxDate}
                        minDate={minDate}
                        sx={{ margin: '30px', marginBottom: '0px' }}
                    />
                </LocalizationProvider>
            </Dialog>
        </div>
    );
};

export default WeekPicker;
