// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.9.0;

contract SupplyChain {
    address public owner;

    event LogManufacturerAdded(address indexed addr, string name, string place);
    event LogDistributorAdded(address indexed addr, string name, string place);
    event LogRetailerAdded(address indexed addr, string name, string place);
    event LogPharmacyAdded(address indexed addr, string name, string place);
    event LogMedicineAdded(uint256 indexed id, string name, string description);
    event LogMedicineStageUpdated(uint256 indexed id, string stage);
    event LogMedicineSold(uint256 indexed batchID, uint256 aadharID);

    constructor() {
        owner = msg.sender;
    }

    modifier onlyByOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    enum STAGE {
        Manufacture,
        Distribution,
        Retail,
        Pharmacy,
        Patient
    }

    struct Role {
        address addr;
        string name;
        string place;
    }

    struct Medicine {
        uint256 id;
        string name;
        string description;
        STAGE stage;
        address manufacturer;
        address distributor;
        address retailer;
        address pharmacy;
    }

    struct MedicineBatch {
        uint256 batchID;
        uint256 medicineID;
        bool sold;
        mapping(uint256 => bool) aadharToSold;
    }

    mapping(address => Role) public manufacturers;
    mapping(address => Role) public distributors;
    mapping(address => Role) public retailers;
    mapping(address => Role) public pharmacies;

    mapping(uint256 => Medicine) public medicines;
    mapping(uint256 => MedicineBatch) public medicineBatches;
    uint256 public medicineCounter;

    // Role management functions
    function addManufacturer(address _address, string memory _name, string memory _place) public onlyByOwner {
        require(_address != address(0), "Invalid address");
        manufacturers[_address] = Role(_address, _name, _place);
        emit LogManufacturerAdded(_address, _name, _place);
    }

    function addDistributor(address _address, string memory _name, string memory _place) public {
        require(manufacturers[msg.sender].addr == msg.sender, "Only manufacturers can add distributors");
        require(_address != address(0), "Invalid address");
        distributors[_address] = Role(_address, _name, _place);
        emit LogDistributorAdded(_address, _name, _place);
    }

    function addRetailer(address _address, string memory _name, string memory _place) public {
        require(distributors[msg.sender].addr == msg.sender, "Only distributors can add retailers");
        require(_address != address(0), "Invalid address");
        retailers[_address] = Role(_address, _name, _place);
        emit LogRetailerAdded(_address, _name, _place);
    }

    function addPharmacy(address _address, string memory _name, string memory _place) public {
        require(retailers[msg.sender].addr == msg.sender, "Only retailers can add pharmacies");
        require(_address != address(0), "Invalid address");
        pharmacies[_address] = Role(_address, _name, _place);
        emit LogPharmacyAdded(_address, _name, _place);
    }

    // Medicine management functions
    function addMedicine(uint256 _batchID, string memory _name, string memory _description) public {
        require(manufacturers[msg.sender].addr == msg.sender, "Only manufacturers can add medicines");
        require(medicines[_batchID].id == 0, "Medicine with this batch ID already exists");

        medicines[_batchID] = Medicine({
            id: _batchID,
            name: _name,
            description: _description,
            stage: STAGE.Manufacture,
            manufacturer: msg.sender,
            distributor: address(0),
            retailer: address(0),
            pharmacy: address(0)
        });

        // Initialize the MedicineBatch mapping for this batchID
        medicineBatches[_batchID].batchID = _batchID;
        medicineBatches[_batchID].medicineID = _batchID;

        medicineCounter++;

        emit LogMedicineAdded(_batchID, _name, _description);
        emit LogMedicineStageUpdated(_batchID, "Manufacture");
    }

    function updateMedicineStage(uint256 _batchID) public {
        Medicine storage med = medicines[_batchID];
        require(med.id != 0, "Invalid batch ID");

        if (med.stage == STAGE.Manufacture) {
            require(distributors[msg.sender].addr == msg.sender, "Only assigned distributor can update stage from Manufacture");
            med.stage = STAGE.Distribution;
            med.distributor = msg.sender;
            emit LogMedicineStageUpdated(_batchID, "Distribution");
        } else if (med.stage == STAGE.Distribution) {
            require(retailers[msg.sender].addr == msg.sender, "Only assigned retailer can update stage from Distribution");
            med.stage = STAGE.Retail;
            med.retailer = msg.sender;
            emit LogMedicineStageUpdated(_batchID, "Retail");
        } else if (med.stage == STAGE.Retail) {
            require(pharmacies[msg.sender].addr == msg.sender, "Only assigned pharmacy can update stage from Retail");
            med.stage = STAGE.Pharmacy;
            med.pharmacy = msg.sender;
            emit LogMedicineStageUpdated(_batchID, "Pharmacy");
        } else {
            revert("Invalid stage transition or unauthorized access");
        }
    }

    function sellMedicine(uint256 _batchID, uint256 _aadharID) public {
        Medicine storage med = medicines[_batchID];
        require(med.id != 0, "Invalid batch ID");
        require(med.stage == STAGE.Pharmacy, "Medicine is not at Pharmacy stage");
        require(pharmacies[msg.sender].addr == msg.sender, "Only assigned pharmacy can sell medicine");

        med.stage = STAGE.Patient;
        medicineBatches[_batchID].aadharToSold[_aadharID] = true;
        medicineBatches[_batchID].sold = true;

        emit LogMedicineSold(_batchID, _aadharID);
        emit LogMedicineStageUpdated(_batchID, "Patient");
    }

    // Query functions
    function getMedicineStage(uint256 _batchID) public view returns (string memory) {
        Medicine storage med = medicines[_batchID];
        require(med.id != 0, "Invalid batch ID");

        if (med.stage == STAGE.Manufacture) return "Manufacture";
        if (med.stage == STAGE.Distribution) return "Distribution";
        if (med.stage == STAGE.Retail) return "Retail";
        if (med.stage == STAGE.Pharmacy) return "Pharmacy";
        if (med.stage == STAGE.Patient) return "Patient";

        return "Unknown";
    }

    function getManufacturerDetails(uint256 _batchID) public view returns (address, string memory, string memory) {
        Medicine storage med = medicines[_batchID];
        require(med.id != 0, "Invalid batch ID");

        Role storage manufacturer = manufacturers[med.manufacturer];
        return (manufacturer.addr, manufacturer.name, manufacturer.place);
    }

    function getDistributorDetails(uint256 _batchID) public view returns (address, string memory, string memory) {
        Medicine storage med = medicines[_batchID];
        require(med.id != 0, "Invalid batch ID");
        require(med.distributor != address(0), "Distributor not assigned yet");

        Role storage distributor = distributors[med.distributor];
        return (distributor.addr, distributor.name, distributor.place);
    }

    function getRetailerDetails(uint256 _batchID) public view returns (address, string memory, string memory) {
        Medicine storage med = medicines[_batchID];
        require(med.id != 0, "Invalid batch ID");
        require(med.retailer != address(0), "Retailer not assigned yet");

        Role storage retailer = retailers[med.retailer];
        return (retailer.addr, retailer.name, retailer.place);
    }

    function getPharmacyDetails(uint256 _batchID) public view returns (address, string memory, string memory) {
        Medicine storage med = medicines[_batchID];
        require(med.id != 0, "Invalid batch ID");
        require(med.pharmacy != address(0), "Pharmacy not assigned yet");

        Role storage pharmacy = pharmacies[med.pharmacy];
        return (pharmacy.addr, pharmacy.name, pharmacy.place);
    }

    function getDrugsByAadhar(uint256 _aadharID) public view returns (uint256[] memory) {
        uint256[] memory tempResult = new uint256[](medicineCounter);
        uint256 count = 0;

        for (uint256 i = 1; i <= medicineCounter; i++) {
            if (medicineBatches[i].aadharToSold[_aadharID]) {
                tempResult[count] = i;
                count++;
            }
        }

        uint256[] memory result = new uint256[](count);
        for (uint256 j = 0; j < count; j++) {
            result[j] = tempResult[j];
        }

        return result;
    }

    // New Function: Get Medicines by Manufacturer Address
    function getMedicinesByManufacturer(address _manufacturer) public view returns (uint256[] memory) {
        uint256[] memory tempResult = new uint256[](medicineCounter);
        uint256 count = 0;

        for (uint256 i = 1; i <= medicineCounter; i++) {
            if (medicines[i].manufacturer == _manufacturer) {
                tempResult[count] = i;
                count++;
            }
        }

        uint256[] memory result = new uint256[](count);
        for (uint256 j = 0; j < count; j++) {
            result[j] = tempResult[j];
        }

        return result;
    }
}
