import React, {useState} from "react";
import WholesalesHomeService from "@/service/wholesales/WholesalesHomeService";
import {homeBuild} from "@/service/wholesales/interface/WholesalesHomePageInterface.ts";
import useEffectOnce from "@/shared/hooks/useEffectOnce.tsx";
import HomeHeader from "@/shared/elements/HomeHeader";
import {usePopup} from "@/popup/PopupProvider.tsx";



 function WholesalesHomePage() {
    const [isLoading, setIsLoading] = useState(false);
    const [homePageData, setHomePageData] = useState<homeBuild[]>([]);
    const wholesalesService = new WholesalesHomeService();
    const { startPopups } = usePopup();

    useEffectOnce(function(){
        loadHomePage();
    },[]);

    function loadHomePage() {
        setIsLoading(true)
        wholesalesService.loadHomePage().then(function(response){
            setIsLoading(false);
            setHomePageData(response.data.data);
            startPopups();
        }, function (error){setIsLoading(false)})
    }


    return (
        <HomeHeader
            loading={isLoading}
            onRefresh={loadHomePage}
            data={homePageData}
            storeName="WHOLESALES AND BULK-SALES"
        />
    );

}


export default React.memo(WholesalesHomePage);
