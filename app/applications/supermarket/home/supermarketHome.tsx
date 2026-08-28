
import React, {useState} from "react";
import SupermarketHomeService from "@/service/supermarket/SupermarketHomeService";
import useEffectOnce from "@/shared/hooks/useEffectOnce.tsx";
import {homeBuild} from "@/service/wholesales/interface/WholesalesHomePageInterface.ts";
import HomeHeader from "@/shared/elements/HomeHeader";
import {usePopup} from "@/popup/PopupProvider.tsx";
import {useCampaign} from "@/campaign/CampaignProvider";


function SupermarketHome() {
    const [isLoading, setIsLoading] = useState(false);
    const [homePageData, setHomePageData] = useState<homeBuild[]>([]);
    const supermarketHomeService = new SupermarketHomeService();
    const { startPopups } = usePopup();
    const { triggerEvent } = useCampaign();

    useEffectOnce(function(){
        loadHomePage();
    },[]);

    function loadHomePage() {
        setIsLoading(true)
        supermarketHomeService.loadHomePage().then(function(response){
            setIsLoading(false)
            setHomePageData(response.data.data ?? []);
            startPopups();
            triggerEvent('HOME_OPENED');
        }, function (error){setIsLoading(false)})
    }

    return (
        <HomeHeader
            loading={isLoading}
            onRefresh={loadHomePage}
            data={homePageData}
            storeName="SUPERMARKET AND PHARMACY"
        />
    );

}


export default React.memo(SupermarketHome);
