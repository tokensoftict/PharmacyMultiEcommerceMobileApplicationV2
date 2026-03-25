import AuthSessionService from "../auth/AuthSessionService.tsx";
import EnvironmentRequest, {EnvironmentRequestInterface} from "@/network/internet/EnvironmentRequest.tsx";

export default class MedReminderService {

    request: EnvironmentRequestInterface
    authSessionService: AuthSessionService

    constructor() {
        this.request = new EnvironmentRequest().getRequest();
        this.authSessionService = new AuthSessionService();
    }

    list() {
        return this.request.get("med-reminder/list");
    }

    show(id: number | string) {
        return this.request.get("med-reminder/"+id+"/show");
    }

    create(data: any) {
        return this.request.post("med-reminder/create", data);
    }

    update(data: any, id : number | string) {
        return this.request.post("med-reminder/"+id+"/update", data);
    }

    remove(id : number | string) {
        return this.request.get("med-reminder/"+id+"/remove");
    }


    loadTodayHistory(filter? : string) {
        if(filter) {
            return this.request.get("med-reminder/today-history?filter="+filter);
        }
        return this.request.get("med-reminder/today-history");
    }

    loadHistoryWithFilter(date :string) {
        return this.request.get("med-reminder/today-history?filter=custom-date&custom-date="+date);
    }

    loadHistoryForReminder(reminder_id :string | number) {
        return this.request.get("med-reminder/today-history?filter=reminder-id&reminder-id="+reminder_id);
    }

    updateHistoryStatus(schedule_id : number | string, data : any) {
        return this.request.post("med-reminder/"+schedule_id+"/updateHistoryStatus", data);
    }
}
