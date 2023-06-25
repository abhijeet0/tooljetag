/** @format */

import React, { useEffect, useState } from "react";
import "./PatientDetails.css";
import { Grid, GridColumn, GridToolbar } from "@progress/kendo-react-all";
import { process } from "@progress/kendo-data-query";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Checkbox } from "@progress/kendo-react-inputs";
import { Button } from "react-bootstrap";
import ConfigurationModal from "./ConfigurationModal";
import { debounce } from "lodash";
import { Menu, MenuItem } from "@progress/kendo-react-layout";
import {
  ExcelExport,
  ExcelExportColumn,
  ExcelExportColumnGroup,
} from "@progress/kendo-react-excel-export";
const columnWidth = "100px";
const initialDataState = {
  sort: [
    {
      field: "code",
      dir: "asc",
    },
  ],
  take: 10,
  skip: 0,
};

function PatientDetails() {
  const [PatientDetailsList, setPatientDetailsList] = useState([]);
  const [dataState, setDataState] = useState(initialDataState);
  const [keysForGrid, setKeysForGrid] = useState([]);
  const [fieldMasterList, setFieldMasterList] = useState([]);
  const [selectedArray, setSelectedArray] = useState(["notes"]);
  const [showConfiguration, setShowConfiguration] = useState(false);
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const _export = React.useRef(null);
  const _grid = React.useRef();
  // console.log("keysForGrid", keysForGrid);
  useEffect(() => {
    setSelectedArray(keysForGrid);
  }, [keysForGrid]);
  async function getPatientDetailsList() {
    setLoading(true);
    await axios
      .get(
        "https://elabnextapi-dev.azurewebsites.net/api/PatientRegistration/GetPatientRegistration"
      )
      .then((response) => {
        setPatientDetailsList(
          response.data.resultData.patientList.map((patient) => {
            const temp = JSON.parse(patient.patientDescription);
            temp.patientId = patient?.patientId;
            return temp;
          })
        );
        setLoading(false);
      })
      .catch((error) => {
        console.log("error -> getPatientDetailsList", error);
        setLoading(false);
      });
    setLoading(true);
    await axios
      .get(
        "https://elabnextapi-dev.azurewebsites.net/api/ReportSetup/GetFieldMaster        "
      )
      .then((response) => {
        setFieldMasterList(response.data.resultData.fieldMaster);
        setLoading(false);
      })
      .catch((error) => {
        console.log("error -> getPatientDetailsList", error);
        setLoading(false);
      });
  }

  useEffect(() => {
    getPatientDetailsList();
  }, []);

  useEffect(() => {
    const temp2 = [];
    PatientDetailsList.map((patient) => {
      const temp = Object.keys(patient);
      temp.map((key) => {
        if (!temp2.includes(key)) {
          temp2.push(key);
        }
      });

      setKeysForGrid(temp2);
    });
  }, [PatientDetailsList]);

  const createGridColumn = (field) => {
    switch (field.componentType) {
      case "TextInput":
        return (
          <GridColumn
            width={columnWidth}
            field={field.value}
            title={field.label}
          />
        );
      case "Datepicker":
        return (
          <GridColumn
            width={columnWidth}
            field={field.value}
            title={field.label}
            cell={(props) => {
              const today = new Date(props.dataItem[field.value]);

              const formattedToday = props.dataItem[field.value]
                ? today.toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })
                : "Date Not Entered";

              return <td> {formattedToday} </td>;
            }}
          />
        );
      case "DropDown":
        return (
          <GridColumn
            width={columnWidth}
            field={field.value}
            title={field.label}
            cell={(props) => {
              return <td>{props.dataItem[field.value]?.label}</td>;
            }}
          />
        );
      case "RadioButton":
        return (
          <GridColumn
            width={columnWidth}
            field={field.value}
            title={field.label}
            cell={(props) => {
              return <td>{props.dataItem[field.value]?.name}</td>;
            }}
          />
        );
      case "NumberInput":
        return (
          <GridColumn
            width={columnWidth}
            field={field.value}
            title={field.label}
            cell={(props) => {
              return (
                <td>
                  {props.dataItem[field.value]?.value
                    ? props.dataItem[field.value]?.value +
                      " " +
                      props.dataItem[field.value]?.ageType
                    : props.dataItem[field.value] +
                      " " +
                      props.dataItem[field.value]?.ageType}
                </td>
              );
            }}
          />
        );
      default:
        return (
          <GridColumn
            width={columnWidth}
            field={field.value}
            title={field.label}
          />
        );
    }
  };
  const onSelect = (event) => {
    // history.push(event.item.data.route);
    history.push({
      pathname: event.item.data.route,
      state: event.item.data.state,
    });
  };
  const handleCheckboxChange = (event) => {
    const { name, value } = event.target;

    if (value) {
      setSelectedArray((prevArray) => {
        const newArray = [...prevArray];
        const index = newArray.indexOf(name);
        if (index !== -1) {
          newArray.splice(index, 1);
        }
        newArray.unshift(name);
        return newArray;
      });
    } else {
      setSelectedArray((prevArray) =>
        prevArray.filter((element) => element !== name)
      );
    }

    // if (value) {
    //   setSelectedArray((prevArray) => [...prevArray, name]);
    // } else {
    //   setSelectedArray((prevArray) =>
    //     prevArray.filter((element) => element !== name)
    //   );
    // }
  };
  const createRows = () => {
    const rows = [];
    for (let i = 0; i < keysForGrid.length; i += 4) {
      const row = keysForGrid.slice(i, i + 4);
      rows.push(
        <tr key={i}>
          {row.map((element, index) => (
            <td key={index}>
              <Checkbox
                name={element}
                value={element}
                label={element
                  .replace(/([A-Z])/g, " $1")
                  .replace(/^./, (match) => match.toUpperCase())}
                // checked={selectedArray.includes(element)}
                onChange={handleCheckboxChange}
                defaultChecked={true}
              />
            </td>
          ))}
        </tr>
      );
    }
    return rows;
  };
  const rowRender = (trElement, props) => {
    const available =
      props.dataItem.patientId > Math.floor(Math.random() * 90) + 10;
    const green = {
      backgroundColor: "rgb(55, 180, 0,0.32)",
    };
    const red = {
      backgroundColor: "rgb(243, 23, 0, 0.32)",
    };
    const trProps = {
      style: available ? green : red,
    };
    return React.cloneElement(
      trElement,
      {
        ...trProps,
      },
      trElement.props.children
    );
  };
  // useEffect(() => {
  //   // Define your function to be called every 10 seconds
  //   const myFunction = () => {
  //     // Your code here
  //     console.log("Function called!", showConfiguration);
  //     getPatientDetailsList();
  //   };

  //   // Set up an interval to call the function every 10 seconds
  //   const intervalId = setInterval(myFunction, 60000);

  //   // Clean up the interval on component unmount
  //   return () => {
  //     clearInterval(intervalId);
  //   };
  // }, []);

  const excelExport = () => {
    if (_export.current !== null) {
      // pass the products, instead the paginated data in the state.
      _export.current.save();
    }
  };
  const itemRender = (props) =>
    `itemId: ${props.itemId}, text: ${props.item.text}`;
  return (
    <div style={{ height: "100vh" }}>
      {loading ? (
        <div />
      ) : (
        <div style={{ padding: "30px" }}>
          <div style={{ display: "flex", gap: "20px" }}>
            {/* <Button>Print</Button>
            <Button>Payment History</Button>
            <Button>Bill Receipts</Button> */}
          </div>
          <ExcelExport data={PatientDetailsList} ref={_export}>
            {selectedArray.map((column) => {
              return (
                <ExcelExportColumn field={column} title={column} width={50} />
              );
            })}
            <ExcelExportColumn field={"actions"} title={"actions"} width={50} />
          </ExcelExport>

          <Grid
            resizable={true}
            pageable={true}
            sortable={true}
            filterable={true}
            reorderable={true}
            data={process(PatientDetailsList, dataState)}
            {...dataState}
            onDataStateChange={(e) => {
              setDataState(e.dataState);
            }}
            style={{ height: "90vh" }}
            // rowRender={rowRender}
            ref={_grid}
          >
            <GridToolbar>
              <Button themeColor={"base"}>Advanced Filters</Button>
              <Button onClick={() => setShowConfiguration(true)} color="gray">
                Configure
              </Button>
              <Button
                title="Export Excel"
                className="k-button k-button-md k-rounded-md k-button-solid k-button-solid-primary"
                onClick={excelExport}
                style={{ backgroundColor: "#4D72FA", border: "none" }}
              >
                Export to Excel
              </Button>
              <Button
                title="Registration Page"
                className="k-button k-button-md k-rounded-md k-button-solid k-button-solid-primary"
                onClick={() => {
                  history.push("/registration-page");
                }}
                style={{ backgroundColor: "#4D72FA", border: "none" }}
              >
                Registration Page
              </Button>
              <Button
                title="Custom Reports"
                className="k-button k-button-md k-rounded-md k-button-solid k-button-solid-primary"
                onClick={() => {
                  history.push("/custom-report");
                }}
                style={{ backgroundColor: "#4D72FA", border: "none" }}
              >
                Custom Reports
              </Button>
            </GridToolbar>
            {selectedArray?.map((key) => {
              return fieldMasterList.map((field) => {
                if (field.value === key) {
                  return createGridColumn(field);
                }
              });
            })}
            <GridColumn
              width={columnWidth}
              field="dd"
              title="Actions"
              cell={(props) => {
                return (
                  <td>
                    {/* <span
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        history.push({
                          pathname: "/result",
                          state: props.dataItem,
                        });
                      }}
                      class="k-icon k-i-print"
                    ></span>
                    <span
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        history.push({
                          pathname: "/registration-page",
                          state: props.dataItem,
                        });
                      }}
                      class="k-icon k-i-edit"
                    ></span> */}

                    {/* <span
                  style={{ cursor: "pointer" }}
                  class="k-icon k-i-table-properties"
                ></span> */}
                    <Menu onSelect={onSelect}>
                      <MenuItem cssStyle={{ color: "black" }} text="more">
                        <MenuItem
                          text="Print"
                          data={{
                            route: "/result",
                            state: props.dataItem,
                          }}
                        />
                        <MenuItem
                          text="Edit Registration"
                          data={{
                            route: "/registration-page",
                            state: props.dataItem,
                          }}
                        />
                        <MenuItem
                          text="Payment History"
                          data={{
                            route: "/about/team",
                          }}
                        />
                        <MenuItem
                          text="Bill Receipts"
                          data={{
                            route: "/about/team",
                          }}
                        />
                      </MenuItem>
                    </Menu>
                  </td>
                );
              }}
            />
          </Grid>
        </div>
      )}
    </div>
  );
}

export default PatientDetails;
