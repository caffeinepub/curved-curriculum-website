import Array "mo:core/Array";
import List "mo:core/List";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";

actor {
  type InquirySubmission = {
    name : Text;
    designation : Text;
    schoolName : Text;
    city : Text;
    phone : Text;
    email : Text;
    message : Text;
  };

  type ProspectusLead = {
    name : Text;
    email : Text;
  };

  var admin : ?Principal = null;

  let submissions = List.empty<InquirySubmission>();
  let leads = List.empty<ProspectusLead>();

  public shared ({ caller }) func setAdmin(newAdmin : Principal) : async () {
    if (caller == newAdmin) { Runtime.trap("Invalid admin principal") };
    admin := ?newAdmin;
  };

  public shared ({ caller }) func submitInquiry(submission : InquirySubmission) : async () {
    submissions.add(submission);
  };

  public shared ({ caller }) func submitLead(lead : ProspectusLead) : async () {
    leads.add(lead);
  };

  public query ({ caller }) func getAllSubmissions() : async [InquirySubmission] {
    switch (admin) {
      case (null) { Runtime.trap("No admin set") };
      case (?adminId) {
        if (caller != adminId) { Runtime.trap("Unauthorized") };
      };
    };
    submissions.toArray();
  };

  public query ({ caller }) func getAllLeads() : async [ProspectusLead] {
    switch (admin) {
      case (null) { Runtime.trap("No admin set") };
      case (?adminId) {
        if (caller != adminId) { Runtime.trap("Unauthorized") };
      };
    };
    leads.toArray();
  };
};
