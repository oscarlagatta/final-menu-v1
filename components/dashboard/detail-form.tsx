'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';

import { zodResolver } from '@hookform/resolvers/zod';
import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons';
import { AlertCircle, Check, CheckCircle2, ChevronsUpDown } from 'lucide-react';
import { toast } from 'sonner';

import { useAuth, useAuthzRules } from '@bofa/auth';
import {
    type MetricModel,
    useMetricsData,
    useUsersData,
} from '@bofa/data-services';
import { QueryLoading } from '@bofa/scorecard-ui';
import {
    Alert,
    AlertDescription,
    AlertTitle,
    Button,
    cn,
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    Input,
    Popover,
    PopoverContent,
    PopoverTrigger,
    Switch,
    Textarea,
} from '@bofa/shadcn-ui-components';
import {
    calculationTypes,
    formatDate,
    STATUS,
    statuses,
    valueTypes,
} from '@bofa/util';

import { UserInfoCard } from './components/user-infor-card';
import { metricSchema } from './schema/metric-schema';
//
type UserModel = {
    nbid: string;
    firstName: string;
    lastName: string;
    fullName: string;
    workEmail: string;
    titleName: string;
    cdssupervisorFullName: string;
    img?: unknown;
};

const runDayOptions = Array.from({ length: 15 }, (_, i: number) => {
    return {
        label: (i + 1).toString(),
        value: (i + 1).toString(),
    };
});

export function MetricDetailForm() {
    const { userDetails } = useAuth();
    const { canEditFeature } = useAuthzRules();

    const [isSubmitting, setIsSubmitting] = useState(false);

    const [search, setSearch] = useState('');

    const navigate = useNavigate();

    const { id } = useParams<{ id: string }>();

    const {
        runFrequencies,
        metricTypes,
        thresholdDirectionTypes,
        metricAlignmentIdentifiers,
        granularity,
        editMetric,
        useGetMetric,
    } = useMetricsData();

    const { data: metric, isLoading, error } = useGetMetric(Number(id));

    const form = useForm<MetricModel>({
        resolver: zodResolver(metricSchema),
        mode: 'onBlur',
        defaultValues: metric ?? {},
    });

    const {
        formState: { errors, isSubmitSuccessful },
    } = form;

    interface ApiError extends Error {
        response?: {
            data?: any;
            status?: any;
            statusText?: string;
        };
    }

    const valueType = form.watch('valueType');

    const [selectedUser, setSelectedUser] = useState<UserModel | null>(null);

    const [statusPopOverOpen, setStatusPopOverOpen] = useState(false);
    const [calculationTypePopOverOpen, setCalculationTypePopOverOpen] =
        useState(false);
    const [metricOwnerOpen, setMetricOwnerOpen] = useState(false);
    const [metricTypePopOverOpen, setMetricTypePopOverOpen] = useState(false);
    const [valueTypePopOverOpen, setValueTypePopOverOpen] = useState(false);
    const [metricAlignmentPopOverOpen, setMetricAlignmentPopOverOpen] =
        useState(false);
    const [granularityNamePopOverOpen, setGranularityNamePopOverOpen] =
        useState(false);
    const [runFrequencyPopOverOpen, setRunFrequencyPopOverOpen] = useState(false);
    const [runDayPopoverOpen, setRunDayPopoverOpen] = useState(false);

    const [
        thresholdDirectionTypePopOverOpen,
        setThresholdDirectionTypePopOverOpen,
    ] = useState(false);

    const initialMetricOwnerId = form.getValues('metricOwnerId');
    const initialMetricOwner = form.getValues('metricOwner');

    const formatInitialMetricOwner = (owner: string) => {
        const [lastName, firstName] = owner.split(',').map((part) => part.trim());
        return `${firstName} ${lastName}`;
    };

    const handleBackToList = () => {
        navigate('/inventory');
    };

    const initialSearchTerm = initialMetricOwner
        ? formatInitialMetricOwner(initialMetricOwner)
        : '';

    const { data: searchUsers = [], isLoading: isSearchLoading } = useUsersData(
        search || initialSearchTerm
    ) as {
        data: UserModel[];
        isLoading: boolean;
    };

    const users = useMemo(() => {
        if (initialMetricOwnerId) {
            const initialUser = searchUsers?.find(
                (user) => user.nbid === initialMetricOwnerId
            );
            if (initialUser) {
                return [
                    initialUser,
                    ...searchUsers.filter((user) => user.nbid !== initialMetricOwnerId),
                ];
            }
        }
        return searchUsers;
    }, [searchUsers, initialMetricOwnerId]);

    const handleSelect = useCallback(
        (nbId: string) => {
            const user = users.find((u) => u.nbid === nbId);
            if (user) {
                form.setValue('metricOwnerId', user.nbid);
                setSelectedUser(user);
                setMetricOwnerOpen(false);
            }
        },
        [users, form]
    );

    useEffect(() => {
        if (metric) {
            form.reset(metric);
        }
    }, [metric, form]);

    useEffect(() => {
        if (initialMetricOwnerId) {
            const initialUser = users.find(
                (user) => user.nbid === initialMetricOwnerId
            );
            if (initialUser) {
                setSelectedUser(initialUser);
            }
        }
    }, [users, initialMetricOwnerId]);

    const onSubmit = async (formData: MetricModel) => {
        try {
            if (id === undefined) {
                toast.error('Cannot update metric: Metric ID is missing', {
                    position: 'top-center',
                    className: 'bg-red-100 border-red-300 border text-red-800 shadow-lg',
                });
                return;
            }

            setIsSubmitting(true);

            const updatedMetric = {
                ...formData,
                id: Number.parseInt(id, 10),
                updatedDateTime: new Date().toISOString(),
                updatedUserId: userDetails?.id,
            };

            await editMetric({ body: updatedMetric });

            setIsSubmitting(false);

            toast('Metric Updated Successfully', {
                position: 'top-center',
                description: (
                    <div className="flex items-center">
                        <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                        <span>
              The metric with name <strong>{formData.metricName}</strong> has
              been updated.
            </span>
                    </div>
                ),
                duration: 5000,
                className: 'bg-green-50 border-green-200',
            });
        } catch (error) {
            setIsSubmitting(false);
            if (error instanceof Error && error.message === 'MetricNameExists') {
                toast('Metric Name already exists', {
                    position: 'top-center',
                    description: (
                        <div className="flex items-center">
                            <AlertCircle className="mr-2 h-5 w-5 text-red-600" />
                            <span>
                A metric with the name <strong>{formData.metricName}</strong>{' '}
                                already exists.
              </span>
                        </div>
                    ),
                    duration: 5000,
                    className: 'bg-red-100 border-red-300 border text-red-800 shadow-lg',
                });
            } else {
                let errorMessage = 'Error updating metric';
                const apiError = error as ApiError;
                if (apiError?.response?.data) {
                    errorMessage = apiError.response.data;
                }
                toast.error('Failed to update record', {
                    description: errorMessage,
                    position: 'top-center',
                });
            }
        }
    };

    const formatUserSummary = (user: UserModel) =>
        `${user.fullName} - ${user.titleName}`;

    return (
        <>
            <QueryLoading
                isLoading={isLoading || isSubmitting}
                loadingText="Fetchin data"
                showText={false}
            />
            <div className="w-full">
                {error ? (
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Metric Detail Error</AlertTitle>
                        <AlertDescription>
                            Error connecting to backend service, please reload the page.
                        </AlertDescription>
                    </Alert>
                ) : (
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <div className="space-y-8">
                                {/* Header with update button */}
                                <div className="flex items-center justify-between">
                                    <h1 className="text-2xl font-semibold text-gray-900">
                                        Metric Details
                                    </h1>
                                    <Button
                                        type="submit"
                                        disabled={isSubmitting || !canEditFeature()}
                                        className="bg-primary hover:bg-primary/90 h-10 px-4 text-white transition-colors dark:text-black"
                                    >
                                        {isSubmitting ? 'Submitting...' : 'Update Metric'}
                                    </Button>
                                </div>

                                {/* Main form content */}
                                <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                                    {/* Left column */}
                                    <div className="space-y-8">
                                        {/* Metric Definition Section */}
                                        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                                            <h2 className="mb-4 text-lg font-medium text-gray-900 border-b pb-2">
                                                Metric Definition
                                            </h2>
                                            <div className="space-y-4">
                                                <FormField
                                                    control={form.control}
                                                    name="metricName"
                                                    render={({ field }) => (
                                                        <FormItem className="flex flex-col">
                                                            <FormLabel>Metric Name</FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    disabled={form.formState.isSubmitting}
                                                                    {...field}
                                                                    value={field.value ?? ''}
                                                                    className="w-full"
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name="metricDescription"
                                                    render={({ field }) => (
                                                        <FormItem className="flex flex-col">
                                                            <FormLabel>Description</FormLabel>
                                                            <FormControl>
                                                                <Textarea
                                                                    disabled={form.formState.isSubmitting}
                                                                    placeholder="Please enter the metric description..."
                                                                    {...field}
                                                                    value={field.value ?? ''}
                                                                    className="min-h-[100px] w-full"
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                                    <FormField
                                                        control={form.control}
                                                        name="status"
                                                        render={({ field }) => (
                                                            <FormItem className="flex flex-col">
                                                                <FormLabel>Status</FormLabel>
                                                                <Popover
                                                                    open={statusPopOverOpen}
                                                                    onOpenChange={setStatusPopOverOpen}
                                                                >
                                                                    <PopoverTrigger asChild>
                                                                        <FormControl>
                                                                            <Button
                                                                                disabled={form.formState.isSubmitting}
                                                                                variant="outline"
                                                                                role="combobox"
                                                                                className={cn(
                                                                                    'w-full justify-between',
                                                                                    !field.value &&
                                                                                    'text-muted-foreground'
                                                                                )}
                                                                            >
                                                                                {field.value
                                                                                    ? statuses.find(
                                                                                        (type) =>
                                                                                            type.value === field.value
                                                                                    )?.label
                                                                                    : 'Select status'}
                                                                                <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                                            </Button>
                                                                        </FormControl>
                                                                    </PopoverTrigger>
                                                                    <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                                                                        <Command>
                                                                            <CommandInput placeholder="Search Status..." />
                                                                            <CommandList>
                                                                                <CommandEmpty>
                                                                                    No statuses found.
                                                                                </CommandEmpty>
                                                                                <CommandGroup>
                                                                                    {statuses?.map((value) => (
                                                                                        <CommandItem
                                                                                            value={value.label}
                                                                                            key={value.value}
                                                                                            onSelect={() => {
                                                                                                form.setValue(
                                                                                                    'status',
                                                                                                    value.value ?? STATUS.Draft
                                                                                                );
                                                                                                setStatusPopOverOpen(false);
                                                                                            }}
                                                                                        >
                                                                                            <CheckIcon
                                                                                                className={cn(
                                                                                                    'mr-2 h-4 w-4',
                                                                                                    value.value === field.value
                                                                                                        ? 'opacity-100'
                                                                                                        : 'opacity-0'
                                                                                                )}
                                                                                            />
                                                                                            {value.label}
                                                                                        </CommandItem>
                                                                                    ))}
                                                                                </CommandGroup>
                                                                            </CommandList>
                                                                        </Command>
                                                                    </PopoverContent>
                                                                </Popover>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                    <FormField
                                                        control={form.control}
                                                        name="metricTypeId"
                                                        render={({ field }) => (
                                                            <FormItem className="flex flex-col">
                                                                <FormLabel>Metric Type</FormLabel>
                                                                <Popover
                                                                    open={metricTypePopOverOpen}
                                                                    onOpenChange={setMetricTypePopOverOpen}
                                                                >
                                                                    <PopoverTrigger asChild>
                                                                        <FormControl>
                                                                            <Button
                                                                                disabled={form.formState.isSubmitting}
                                                                                variant="outline"
                                                                                role="combobox"
                                                                                className={cn(
                                                                                    'w-full justify-between',
                                                                                    !field.value &&
                                                                                    'text-muted-foreground'
                                                                                )}
                                                                            >
                                                                                {field.value
                                                                                    ? metricTypes?.find(
                                                                                        (type) => type.id === field.value
                                                                                    )?.name
                                                                                    : 'Select metric type'}
                                                                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                                            </Button>
                                                                        </FormControl>
                                                                    </PopoverTrigger>
                                                                    <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                                                                        <Command>
                                                                            <CommandInput placeholder="Search metric type..." />
                                                                            <CommandList>
                                                                                <CommandEmpty>
                                                                                    No metric type found.
                                                                                </CommandEmpty>
                                                                                <CommandGroup>
                                                                                    {metricTypes?.map((type) => (
                                                                                        <CommandItem
                                                                                            value={type.name ?? ''}
                                                                                            key={type.id}
                                                                                            onSelect={() => {
                                                                                                form.setValue(
                                                                                                    'metricTypeId',
                                                                                                    type.id
                                                                                                );
                                                                                                setMetricTypePopOverOpen(false);
                                                                                            }}
                                                                                        >
                                                                                            <Check
                                                                                                className={cn(
                                                                                                    'mr-2 h-4 w-4',
                                                                                                    type.name === field.value
                                                                                                        ? 'opacity-100'
                                                                                                        : 'opacity-0'
                                                                                                )}
                                                                                            />
                                                                                            {type.name}
                                                                                        </CommandItem>
                                                                                    ))}
                                                                                </CommandGroup>
                                                                            </CommandList>
                                                                        </Command>
                                                                    </PopoverContent>
                                                                </Popover>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Source/Contact Section */}
                                        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                                            <h2 className="mb-4 text-lg font-medium text-gray-900 border-b pb-2">
                                                Source/Contact
                                            </h2>
                                            <div className="space-y-4">
                                                <FormField
                                                    control={form.control}
                                                    name="metricOwnerId"
                                                    render={({ field }) => (
                                                        <FormItem className="flex flex-col">
                                                            <FormLabel>Metric Owner</FormLabel>
                                                            <Popover
                                                                open={metricOwnerOpen}
                                                                onOpenChange={setMetricOwnerOpen}
                                                            >
                                                                <PopoverTrigger asChild>
                                                                    <FormControl>
                                                                        <Button
                                                                            disabled={form.formState.isSubmitting}
                                                                            variant="outline"
                                                                            role="combobox"
                                                                            className={cn(
                                                                                'w-full justify-between',
                                                                                !field.value && 'text-muted-foreground'
                                                                            )}
                                                                        >
                                                                            {selectedUser
                                                                                ? formatUserSummary(selectedUser)
                                                                                : 'Select metric owner'}
                                                                            <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                                        </Button>
                                                                    </FormControl>
                                                                </PopoverTrigger>
                                                                <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                                                                    <Command>
                                                                        <CommandInput
                                                                            placeholder="Search metric owner..."
                                                                            onValueChange={(value) => {
                                                                                if (value.length >= 2) {
                                                                                    setSearch(value);
                                                                                }
                                                                            }}
                                                                        />
                                                                        <CommandList>
                                                                            <CommandEmpty>
                                                                                {isSearchLoading
                                                                                    ? 'Searching...'
                                                                                    : 'No owner found.'}
                                                                            </CommandEmpty>
                                                                            <CommandGroup>
                                                                                {Array.isArray(users) &&
                                                                                    users?.map((user: UserModel) => (
                                                                                        <CommandItem
                                                                                            value={user.fullName}
                                                                                            key={user.nbid}
                                                                                            onSelect={() =>
                                                                                                handleSelect(user.nbid)
                                                                                            }
                                                                                        >
                                                                                            <UserInfoCard user={user} />
                                                                                        </CommandItem>
                                                                                    ))}
                                                                            </CommandGroup>
                                                                        </CommandList>
                                                                    </Command>
                                                                </PopoverContent>
                                                            </Popover>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name="connectionDetails"
                                                    render={({ field }) => (
                                                        <FormItem className="flex flex-col">
                                                            <FormLabel>Connection Details</FormLabel>
                                                            <FormControl>
                                                                <Textarea
                                                                    disabled={form.formState.isSubmitting}
                                                                    placeholder="Connection Details..."
                                                                    {...field}
                                                                    value={field.value ?? ''}
                                                                    rows={6}
                                                                    className="font-mono text-sm"
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                        </div>

                                        {/* Metric Thresholds Section */}
                                        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                                            <h2 className="mb-4 text-lg font-medium text-gray-900 border-b pb-2">
                                                Metric Thresholds
                                            </h2>
                                            <div className="space-y-4">
                                                <FormField
                                                    control={form.control}
                                                    name="thresholdDirectionTypeId"
                                                    render={({ field }) => (
                                                        <FormItem className="flex flex-col">
                                                            <FormLabel>Threshold Direction Type</FormLabel>
                                                            <Popover
                                                                open={thresholdDirectionTypePopOverOpen}
                                                                onOpenChange={
                                                                    setThresholdDirectionTypePopOverOpen
                                                                }
                                                            >
                                                                <PopoverTrigger asChild>
                                                                    <FormControl>
                                                                        <Button
                                                                            disabled={form.formState.isSubmitting}
                                                                            variant="outline"
                                                                            role="combobox"
                                                                            className={cn(
                                                                                'w-full justify-between',
                                                                                !field.value && 'text-muted-foreground'
                                                                            )}
                                                                        >
                                                                            {field.value
                                                                                ? thresholdDirectionTypes?.find(
                                                                                    (type) => type.id === field.value
                                                                                )?.name
                                                                                : 'Select threshold direction type'}
                                                                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                                        </Button>
                                                                    </FormControl>
                                                                </PopoverTrigger>
                                                                <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                                                                    <Command>
                                                                        <CommandInput placeholder="Search metric type..." />
                                                                        <CommandList>
                                                                            <CommandEmpty>
                                                                                No threshold direction type found.
                                                                            </CommandEmpty>
                                                                            <CommandGroup>
                                                                                {thresholdDirectionTypes?.map(
                                                                                    (type) => (
                                                                                        <CommandItem
                                                                                            value={type.name ?? ''}
                                                                                            key={type.id}
                                                                                            onSelect={() => {
                                                                                                form.setValue(
                                                                                                    'thresholdDirectionTypeId',
                                                                                                    type.id
                                                                                                );
                                                                                                setThresholdDirectionTypePopOverOpen(
                                                                                                    false
                                                                                                );
                                                                                            }}
                                                                                        >
                                                                                            <Check
                                                                                                className={cn(
                                                                                                    'mr-2 h-4 w-4',
                                                                                                    type.name === field.value
                                                                                                        ? 'opacity-100'
                                                                                                        : 'opacity-0'
                                                                                                )}
                                                                                            />
                                                                                            {type.name}
                                                                                        </CommandItem>
                                                                                    )
                                                                                )}
                                                                            </CommandGroup>
                                                                        </CommandList>
                                                                    </Command>
                                                                </PopoverContent>
                                                            </Popover>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name="valueType"
                                                    render={({ field }) => (
                                                        <FormItem className="flex flex-col">
                                                            <FormLabel>Value Type</FormLabel>
                                                            <Popover
                                                                open={valueTypePopOverOpen}
                                                                onOpenChange={setValueTypePopOverOpen}
                                                            >
                                                                <PopoverTrigger asChild>
                                                                    <FormControl>
                                                                        <Button
                                                                            disabled={form.formState.isSubmitting}
                                                                            variant="outline"
                                                                            role="combobox"
                                                                            className={cn(
                                                                                'w-full justify-between',
                                                                                !field.value && 'text-muted-foreground'
                                                                            )}
                                                                        >
                                                                            {field.value
                                                                                ? valueTypes?.find(
                                                                                    (type) => type.value === field.value
                                                                                )?.label
                                                                                : 'Select value type'}
                                                                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                                        </Button>
                                                                    </FormControl>
                                                                </PopoverTrigger>
                                                                <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                                                                    <Command>
                                                                        <CommandInput placeholder="Search metric type..." />
                                                                        <CommandList>
                                                                            <CommandEmpty>
                                                                                No value types found.
                                                                            </CommandEmpty>
                                                                            <CommandGroup>
                                                                                {valueTypes?.map((value) => (
                                                                                    <CommandItem
                                                                                        value={value.label ?? ''}
                                                                                        key={value.value}
                                                                                        onSelect={() => {
                                                                                            form.setValue(
                                                                                                'valueType',
                                                                                                value.value ?? ''
                                                                                            );
                                                                                            setValueTypePopOverOpen(false);
                                                                                        }}
                                                                                    >
                                                                                        <CheckIcon
                                                                                            className={cn(
                                                                                                'mr-2 h-4 w-4',
                                                                                                value.name === field.value
                                                                                                    ? 'opacity-100'
                                                                                                    : 'opacity-0'
                                                                                            )}
                                                                                        />
                                                                                        {value.label}
                                                                                    </CommandItem>
                                                                                ))}
                                                                            </CommandGroup>
                                                                        </CommandList>
                                                                    </Command>
                                                                </PopoverContent>
                                                            </Popover>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                                    <FormField
                                                        control={form.control}
                                                        name="trigger"
                                                        render={({ field }) => (
                                                            <FormItem className="flex flex-col">
                                                                <FormLabel>
                                                                    Trigger{valueType === '%' ? ' (%) ' : ''}
                                                                </FormLabel>
                                                                <FormControl>
                                                                    <Input
                                                                        type="number"
                                                                        {...field}
                                                                        value={field.value}
                                                                        onChange={(e) =>
                                                                            field.onChange(
                                                                                e.target.value
                                                                                    ? Number(e.target.value)
                                                                                    : undefined
                                                                            )
                                                                        }
                                                                    />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                    <FormField
                                                        control={form.control}
                                                        name="limit"
                                                        render={({ field }) => (
                                                            <FormItem className="flex flex-col">
                                                                <FormLabel>
                                                                    Limit{valueType === '%' ? ' (%) ' : ''}
                                                                </FormLabel>
                                                                <FormControl>
                                                                    <Input
                                                                        type="number"
                                                                        {...field}
                                                                        value={
                                                                            field.value !== undefined
                                                                                ? String(field.value)
                                                                                : ''
                                                                        }
                                                                        onChange={(e) =>
                                                                            field.onChange(
                                                                                e.target.value
                                                                                    ? Number(e.target.value)
                                                                                    : undefined
                                                                            )
                                                                        }
                                                                    />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Consequence Settings Section */}
                                        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                                            <h2 className="mb-4 text-lg font-medium text-gray-900 border-b pb-2">
                                                Consequence Settings
                                            </h2>
                                            <div className="space-y-4">
                                                <FormField
                                                    control={form.control}
                                                    name="consequenceEligible"
                                                    render={({ field }) => (
                                                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                                            <div className="space-y-0.5">
                                                                <FormLabel className="text-base">
                                                                    Consequence Eligible
                                                                </FormLabel>
                                                                <FormDescription>
                                                                    Eligibility criteria for regulatory capital.
                                                                </FormDescription>
                                                            </div>
                                                            <FormControl>
                                                                <Switch
                                                                    disabled={form.formState.isSubmitting}
                                                                    checked={field.value ?? false}
                                                                    onCheckedChange={field.onChange}
                                                                />
                                                            </FormControl>
                                                        </FormItem>
                                                    )}
                                                />
                                                {/* Add spacer for better balance */}
                                                <div className="py-8"></div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right column */}
                                    <div className="space-y-8">
                                        {/* Calculation Methodology Section */}
                                        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                                            <h2 className="mb-4 text-lg font-medium text-gray-900 border-b pb-2">
                                                Calculation Methodology
                                            </h2>
                                            <div className="space-y-4">
                                                <FormField
                                                    control={form.control}
                                                    name="query"
                                                    render={({ field }) => (
                                                        <FormItem className="flex flex-col">
                                                            <FormLabel>Performance Query</FormLabel>
                                                            <FormControl>
                                                                <Textarea
                                                                    disabled={form.formState.isSubmitting}
                                                                    placeholder="Please enter the performance query..."
                                                                    {...field}
                                                                    value={field.value ?? ''}
                                                                    rows={6}
                                                                    className="font-mono text-sm"
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name="metricPerformanceTableUsed"
                                                    render={({ field }) => (
                                                        <FormItem className="flex flex-col">
                                                            <FormLabel>Tables Used By The Query</FormLabel>
                                                            <FormControl>
                                                                <Textarea
                                                                    disabled={form.formState.isSubmitting}
                                                                    placeholder="Please enter the tables used by the query..."
                                                                    {...field}
                                                                    value={field.value ?? ''}
                                                                    rows={3}
                                                                    className="font-mono text-sm"
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name="metricCalculationType"
                                                    render={({ field }) => (
                                                        <FormItem className="flex flex-col">
                                                            <FormLabel>Calculation Type</FormLabel>
                                                            <Popover
                                                                open={calculationTypePopOverOpen}
                                                                onOpenChange={setCalculationTypePopOverOpen}
                                                            >
                                                                <PopoverTrigger asChild>
                                                                    <FormControl>
                                                                        <Button
                                                                            disabled={form.formState.isSubmitting}
                                                                            variant="outline"
                                                                            role="combobox"
                                                                            className={cn(
                                                                                'w-full justify-between',
                                                                                !field.value && 'text-muted-foreground'
                                                                            )}
                                                                        >
                                                                            {field.value
                                                                                ? calculationTypes?.find(
                                                                                    (type) => type.value === field.value
                                                                                )?.label
                                                                                : 'Select Calculation Type'}
                                                                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                                        </Button>
                                                                    </FormControl>
                                                                </PopoverTrigger>
                                                                <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                                                                    <Command>
                                                                        <CommandInput placeholder="Search metric type..." />
                                                                        <CommandList>
                                                                            <CommandEmpty>
                                                                                No types found.
                                                                            </CommandEmpty>
                                                                            <CommandGroup>
                                                                                {calculationTypes?.map((value) => (
                                                                                    <CommandItem
                                                                                        value={value.value}
                                                                                        key={value.value}
                                                                                        onSelect={() => {
                                                                                            form.setValue(
                                                                                                'metricCalculationType',
                                                                                                value.label ?? ''
                                                                                            );
                                                                                            setCalculationTypePopOverOpen(
                                                                                                false
                                                                                            );
                                                                                        }}
                                                                                    >
                                                                                        <CheckIcon
                                                                                            className={cn(
                                                                                                'mr-2 h-4 w-4',
                                                                                                value.name === field.value
                                                                                                    ? 'opacity-100'
                                                                                                    : 'opacity-0'
                                                                                            )}
                                                                                        />
                                                                                        {value.label}
                                                                                    </CommandItem>
                                                                                ))}
                                                                            </CommandGroup>
                                                                        </CommandList>
                                                                    </Command>
                                                                </PopoverContent>
                                                            </Popover>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name="metricCalculation"
                                                    render={({ field }) => (
                                                        <FormItem className="flex flex-col">
                                                            <FormLabel>Metric Calculation</FormLabel>
                                                            <FormControl>
                                                                <Textarea
                                                                    disabled={form.formState.isSubmitting}
                                                                    placeholder="Please enter the metric calculation..."
                                                                    {...field}
                                                                    value={field.value ?? ''}
                                                                    rows={6}
                                                                    className="font-mono text-sm"
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                        </div>

                                        {/* Metric Settings Section */}
                                        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                                            <h2 className="mb-4 text-lg font-medium text-gray-900 border-b pb-2">
                                                Metric Settings
                                            </h2>
                                            <div className="space-y-4">
                                                <FormField
                                                    control={form.control}
                                                    name="metricAlignmentIdentifierId"
                                                    render={({ field }) => (
                                                        <FormItem className="flex flex-col">
                                                            <FormLabel>Metric Alignment</FormLabel>
                                                            <Popover
                                                                open={metricAlignmentPopOverOpen}
                                                                onOpenChange={setMetricAlignmentPopOverOpen}
                                                            >
                                                                <PopoverTrigger asChild>
                                                                    <FormControl>
                                                                        <Button
                                                                            disabled={form.formState.isSubmitting}
                                                                            variant="outline"
                                                                            role="combobox"
                                                                            className={cn(
                                                                                'w-full justify-between',
                                                                                !field.value && 'text-muted-foreground'
                                                                            )}
                                                                        >
                                                                            {field.value
                                                                                ? metricAlignmentIdentifiers?.find(
                                                                                    (service) =>
                                                                                        service.id === field.value
                                                                                )?.name
                                                                                : 'Select alignment'}
                                                                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                                        </Button>
                                                                    </FormControl>
                                                                </PopoverTrigger>
                                                                <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                                                                    <Command>
                                                                        <CommandInput placeholder="Search service..." />
                                                                        <CommandList>
                                                                            <CommandEmpty>
                                                                                No metric alignment identifier found.
                                                                            </CommandEmpty>
                                                                            <CommandGroup>
                                                                                {metricAlignmentIdentifiers?.map(
                                                                                    (metric) => (
                                                                                        <CommandItem
                                                                                            value={metric.name ?? ''}
                                                                                            key={metric.id}
                                                                                            onSelect={() => {
                                                                                                form.setValue(
                                                                                                    'metricAlignmentIdentifierId',
                                                                                                    metric.id
                                                                                                );
                                                                                                setMetricAlignmentPopOverOpen(
                                                                                                    false
                                                                                                );
                                                                                            }}
                                                                                        >
                                                                                            <Check
                                                                                                className={cn(
                                                                                                    'mr-2 h-4 w-4',
                                                                                                    metric.name === field.value
                                                                                                        ? 'opacity-100'
                                                                                                        : 'opacity-0'
                                                                                                )}
                                                                                            />
                                                                                            {metric.name}
                                                                                        </CommandItem>
                                                                                    )
                                                                                )}
                                                                            </CommandGroup>
                                                                        </CommandList>
                                                                    </Command>
                                                                </PopoverContent>
                                                            </Popover>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name="dataGranularityId"
                                                    render={({ field }) => (
                                                        <FormItem className="flex flex-col">
                                                            <FormLabel>Granularity</FormLabel>
                                                            <Popover
                                                                open={granularityNamePopOverOpen}
                                                                onOpenChange={setGranularityNamePopOverOpen}
                                                            >
                                                                <PopoverTrigger asChild>
                                                                    <FormControl>
                                                                        <Button
                                                                            disabled={form.formState.isSubmitting}
                                                                            variant="outline"
                                                                            role="combobox"
                                                                            className={cn(
                                                                                'w-full justify-between',
                                                                                !field.value && 'text-muted-foreground'
                                                                            )}
                                                                        >
                                                                            {field.value
                                                                                ? granularity?.find(
                                                                                    (g) => g.id === field.value
                                                                                )?.name
                                                                                : 'Select granularity'}
                                                                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                                        </Button>
                                                                    </FormControl>
                                                                </PopoverTrigger>
                                                                <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                                                                    <Command>
                                                                        <CommandInput placeholder="Search granularity..." />
                                                                        <CommandList>
                                                                            <CommandEmpty>
                                                                                No granularity found.
                                                                            </CommandEmpty>
                                                                            <CommandGroup>
                                                                                {granularity?.map((granularity) => (
                                                                                    <CommandItem
                                                                                        value={granularity.name ?? ''}
                                                                                        key={granularity.id}
                                                                                        onSelect={() => {
                                                                                            form.setValue(
                                                                                                'dataGranularityId',
                                                                                                granularity.id
                                                                                            );
                                                                                            setGranularityNamePopOverOpen(
                                                                                                false
                                                                                            );
                                                                                        }}
                                                                                    >
                                                                                        <CheckIcon
                                                                                            className={cn(
                                                                                                'mr-2 h-4 w-4',
                                                                                                granularity.id === field.value
                                                                                                    ? 'opacity-100'
                                                                                                    : 'opacity-0'
                                                                                            )}
                                                                                        />
                                                                                        {granularity.name}
                                                                                    </CommandItem>
                                                                                ))}
                                                                            </CommandGroup>
                                                                        </CommandList>
                                                                    </Command>
                                                                </PopoverContent>
                                                            </Popover>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                {/* Add spacer for better balance */}
                                                <div className="py-8"></div>
                                            </div>
                                        </div>

                                        {/* Metric Schedule Section */}
                                        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                                            <h2 className="mb-4 text-lg font-medium text-gray-900 border-b pb-2">
                                                Metric Schedule
                                            </h2>
                                            <div className="space-y-4">
                                                <FormField
                                                    control={form.control}
                                                    name="runFrequencyId"
                                                    render={({ field }) => (
                                                        <FormItem className="flex flex-col">
                                                            <FormLabel>Run Frequency</FormLabel>
                                                            <Popover
                                                                open={runFrequencyPopOverOpen}
                                                                onOpenChange={setRunFrequencyPopOverOpen}
                                                            >
                                                                <PopoverTrigger asChild>
                                                                    <FormControl>
                                                                        <Button
                                                                            disabled={form.formState.isSubmitting}
                                                                            variant="outline"
                                                                            role="combobox"
                                                                            className={cn(
                                                                                'w-full justify-between',
                                                                                !field.value && 'text-muted-foreground'
                                                                            )}
                                                                        >
                                                                            {field.value
                                                                                ? runFrequencies?.find(
                                                                                    (type) => type.id === field.value
                                                                                )?.name
                                                                                : 'Select run frequency'}
                                                                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                                        </Button>
                                                                    </FormControl>
                                                                </PopoverTrigger>
                                                                <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                                                                    <Command>
                                                                        <CommandInput placeholder="Search service..." />
                                                                        <CommandList>
                                                                            <CommandEmpty>
                                                                                No run frequency found.
                                                                            </CommandEmpty>
                                                                            <CommandGroup>
                                                                                {runFrequencies?.map((type) => (
                                                                                    <CommandItem
                                                                                        value={type.name ?? ''}
                                                                                        key={type.id}
                                                                                        onSelect={() => {
                                                                                            form.setValue(
                                                                                                'runFrequencyId',
                                                                                                type.id
                                                                                            );
                                                                                            setRunFrequencyPopOverOpen(false);
                                                                                        }}
                                                                                    >
                                                                                        <CheckIcon
                                                                                            className={cn(
                                                                                                'mr-2 h-4 w-4',
                                                                                                type.name === field.value
                                                                                                    ? 'opacity-100'
                                                                                                    : 'opacity-0'
                                                                                            )}
                                                                                        />
                                                                                        {type.name}
                                                                                    </CommandItem>
                                                                                ))}
                                                                            </CommandGroup>
                                                                        </CommandList>
                                                                    </Command>
                                                                </PopoverContent>
                                                            </Popover>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name="runDay"
                                                    render={({ field }) => (
                                                        <FormItem className="flex flex-col">
                                                            <FormLabel>Business Day</FormLabel>
                                                            <Popover
                                                                open={runDayPopoverOpen}
                                                                onOpenChange={setRunDayPopoverOpen}
                                                            >
                                                                <PopoverTrigger asChild>
                                                                    <FormControl>
                                                                        <Button
                                                                            disabled={form.formState.isSubmitting}
                                                                            variant="outline"
                                                                            role="combobox"
                                                                            className={cn(
                                                                                'w-full justify-between',
                                                                                !field.value && 'text-muted-foreground'
                                                                            )}
                                                                        >
                                                                            {field.value
                                                                                ? runDayOptions?.find(
                                                                                    (type) => type.value === field.value
                                                                                )?.label
                                                                                : 'Select run day'}
                                                                            <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                                        </Button>
                                                                    </FormControl>
                                                                </PopoverTrigger>
                                                                <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                                                                    <Command>
                                                                        <CommandInput placeholder="Search service..." />
                                                                        <CommandList>
                                                                            <CommandEmpty>
                                                                                No run days found.
                                                                            </CommandEmpty>
                                                                            <CommandGroup>
                                                                                {runDayOptions?.map((value) => (
                                                                                    <CommandItem
                                                                                        value={value.label ?? ''}
                                                                                        key={value.value}
                                                                                        onSelect={() => {
                                                                                            form.setValue(
                                                                                                'runDay',
                                                                                                value.value
                                                                                            );
                                                                                            setRunDayPopoverOpen(false);
                                                                                        }}
                                                                                    >
                                                                                        <CheckIcon
                                                                                            className={cn(
                                                                                                'mr-2 h-4 w-4',
                                                                                                value.value === field.value
                                                                                                    ? 'opacity-100'
                                                                                                    : 'opacity-0'
                                                                                            )}
                                                                                        />
                                                                                        {value.label}
                                                                                    </CommandItem>
                                                                                ))}
                                                                            </CommandGroup>
                                                                        </CommandList>
                                                                    </Command>
                                                                </PopoverContent>
                                                            </Popover>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                {/* Add spacer for better balance */}
                                                <div className="py-8"></div>
                                            </div>
                                        </div>

                                        {/* Audit Information Section */}
                                        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                                            <h2 className="mb-4 text-lg font-medium text-gray-900 border-b pb-2">
                                                Audit Information
                                            </h2>
                                            <div className="space-y-4">
                                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                                    <FormField
                                                        disabled
                                                        control={form.control}
                                                        name="createdBy"
                                                        render={({ field }) => (
                                                            <FormItem className="flex flex-col">
                                                                <FormLabel>Created By</FormLabel>
                                                                <FormControl>
                                                                    <Input
                                                                        placeholder="Created By..."
                                                                        {...field}
                                                                        value={field.value ?? ''}
                                                                        className="bg-gray-50"
                                                                    />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                    <FormField
                                                        disabled
                                                        control={form.control}
                                                        name="createdDateTime"
                                                        render={({ field }) => (
                                                            <FormItem className="flex flex-col">
                                                                <FormLabel>Created Date</FormLabel>
                                                                <FormControl>
                                                                    <Input
                                                                        placeholder="Created Date..."
                                                                        {...field}
                                                                        value={formatDate(
                                                                            field.value ?? new Date()
                                                                        )}
                                                                        className="bg-gray-50"
                                                                    />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                </div>
                                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                                    <FormField
                                                        disabled
                                                        control={form.control}
                                                        name="updatedBy"
                                                        render={({ field }) => (
                                                            <FormItem className="flex flex-col">
                                                                <FormLabel>Updated By</FormLabel>
                                                                <FormControl>
                                                                    <Input
                                                                        placeholder="Updated By..."
                                                                        {...field}
                                                                        value={field.value ?? ''}
                                                                        className="bg-gray-50"
                                                                    />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                    <FormField
                                                        disabled
                                                        control={form.control}
                                                        name="updatedDateTime"
                                                        render={({ field }) => (
                                                            <FormItem className="flex flex-col">
                                                                <FormLabel>Updated Date</FormLabel>
                                                                <FormControl>
                                                                    <Input
                                                                        placeholder="Updated Date..."
                                                                        {...field}
                                                                        value={formatDate(
                                                                            field.value ?? new Date()
                                                                        )}
                                                                        className="bg-gray-50"
                                                                    />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Additional Information Section - Removed as per request */}
                                    </div>
                                </div>
                            </div>
                        </form>
                    </Form>
                )}
            </div>
        </>
    );
}
