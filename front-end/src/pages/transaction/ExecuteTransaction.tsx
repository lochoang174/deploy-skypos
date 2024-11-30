import React, { useState } from "react";
import { Button, message, Steps } from "antd";
import { CiMoneyCheck1 } from "react-icons/ci";
import { IoPhonePortraitOutline } from "react-icons/io5";
import { MdOutlineDoneOutline, MdVerifiedUser } from "react-icons/md";
import AddProduct from "../../components/Transaction/AddProduct";
import Verification from "../../components/Transaction/Verification";
import Pay from "../../components/Transaction/Pay";




const ExecuteTransaction = () => {
  const [current, setCurrent] = useState(0);

  const next = () => {
    if (current < steps.length - 1) {
      setCurrent(current + 1);
    } else {
      message.success("Processing complete!");
    }
  };

  const prev = () => {
    if (current > 0) {
      setCurrent(current - 1);
    }
  };
  const steps = [
    {
      title: "Add product",
      component: <AddProduct nextStep={()=>{setCurrent(1)}} />,
      icon: <IoPhonePortraitOutline />,
    },
    {
      title: "Verification",
      component: <Verification  nextStep={()=>{setCurrent(2)}}/>,
      icon: <MdVerifiedUser />,
    },
    {
      title: "Pay",
      component: <Pay backToFirstStep={()=>{setCurrent(0)}}/>,
      icon: <CiMoneyCheck1 className="self-center" />,
    },
    // {
    //   title: "Done",
    //   component: <Done/>,
    //   icon: <MdOutlineDoneOutline />,
    // },
  ];
  return (
    <div className="mt-3 p-4 h-[100%] flex flex-col">
      <Steps
        current={current}
        items={steps.map((step) => ({
          title: step.title,
          // status: step.status,
          icon: step.icon,
        }))}
      />
      <div className="grow mt-4">{steps[current].component}</div>
      <div className="flex gap-2 self-start">
        <div style={{ marginTop: 24 }}>
          {/* {current < steps.length - 1 && (
            <Button type="primary" onClick={next}>
              Next
            </Button>
          )} */}
          {current > 0 && (
            <Button style={{ margin: "0 8px" }} onClick={prev}>
              Previous
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExecuteTransaction;