import { Badge } from "@chakra-ui/react";

function Status({ status }) {
    // status → color mapping
    const statusColors = {
        Pending: "orange",
        Unverified: "orange",
        Resigned: "orange",
        Unpaid: "orange",

        Verified: "green",
        Approved: "green",
        Advanced: "green",
        Paid: "green",

        Canceled: "red",
        Terminated: "red",
    };

    // fallback if status not found
    const color = statusColors[status] || "gray";

    return (
        <Badge size="md" variant="solid" colorPalette={color}>
            {status}
        </Badge>
    );
}

export default Status;
