import {useEffect, useState} from "react";

type SupportManager = {
    name: string | null | undefined;
    id: string | null | undefined;
}

type TeamLead = {
    name: string | null | undefined;
    id: string | null | undefined;
}
type ApplicationModel = {
    id: string;
    apsSupportContact: string;
    apsTechnicalLeadName:string;
    apsSupportManger:  string;
    techLead: string;
    apsTechnicalLeadnbkid: string;
    apsPortfoliIdName: string;
    ucalFlag: boolean;
    businessservicedes: string[];
}

type Filters = {
    supportManager: string;
    techLead: string;
    portfolio: string;
    ucal: string;
    criticalService: string;
    attestationDue: string;
}

export default function AppPortfolio() {
    const { applications, portfolios, isLoading } = useApplicationsPresenter();

    const [ applicationList, setApplicationsList] = useState(applications);
    const [ supportManagerList, setSupportManagerList] = useState(portfolios);

    const [supportManagerList, setSupportManagerList] = useState<SupportManager[]>([]);

    const [teamLeadList, setTeamLeadList] = useState<TeamLead[]>([]);

    const [filters, setFilters]= useState<Filters>({
        supportManager: '',
        techLead: '',
        portfolio: '',
        ucal: '',
        criticalService: '',
        attestationDue: ''
    });

    const [appliedFilters, setAppliedFilters] = useState<Filters>(filters);


    const applyFilters = () => {
        setAppliedFilters(filters);
        const filteredApplications = applications.filter(
            (x) => {
                (filters.supportManager !== '' && filters.supportManager !== undefined
                ? x?.apsSupportManger
                    ?.trim()
                    .toLowerCase()
                    .includes(filters.supportManager.trim().toLowerCase())
                : true) &&
            (filters.techLead !== '' && filters.techLead !== undefined
                ? x?.apsTechnicalLeadnbkid
                    ?.trim()
                    .toLowerCase()
                    .includes(filters.techLead.trim().toLowerCase())
                : true) &&
            (filters.portfolio !== '' && filters.portfolio !== undefined ? x.apsPortfoliIdName == filters.portfolio : true) &&
            (filters.ucal !== '' && filters.ucal !== undefined ? x.ucalFlag?.toString() === filters.ucal : true) &&
            (filters.criticalService !== undefined &&
             filters.criticalService !== '' &&
            parseInt(filters.criticalService)
                ? filters.criticalService === '1'
                ? x.businessservicedes?.length !== undefined &&
                        x.businessservicedes.length > 0
                        : x.businessservicedes?.length === 0
                    : true) &&
            (filters.attestationDue !== undefined &&
              filters.attestationDue !== '' &&
            parseInt(filters.attestationDue) ? true: true)
        });
        setIsFilterOpen(false);
        setApplicationsList(filteredApplications);
    }

    // useEffect(() => {
    //     const supportManagerList = applications.filter(
    //         (application: ApplicationModel) =>
    //             application.apsSupportContact !== null && application.apsSupportContact !== undefined
    //     )
    //         .map((x) => ({
    //             name: x.apsSupportContatc,
    //             id: x.apsSupportManager
    //         }))
    //         .filter((value, index, self) => self.findIndex((t) => t.id === value.id) === index);
    //
    //     setSupportManagerList(supportManagerList);
    //
    //     const teamLeadList = applications.filter(
    //         (application: ApplicationModel) =>
    //             application.apsTechnicalLeadName !== null && application.apsTechnicalLeadName !== undefined
    //     )
    //         .map((x) => ({
    //             name: x.apsTechnicalLeadName,
    //             id: x.apsTechnicalLeadnbkid
    //         }))
    //         .filter((value, index, self) => self.findIndex((t) => t.id === value.id) === index);
    //
    //     setTeamLeadList(teamLeadList);
    // })
}