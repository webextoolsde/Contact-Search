import { Desktop } from "@wxcc-desktop/sdk";

const template = document.createElement("template");
const bottoken = "YTFiM2Y5MDQtZTZkNy00NmVkLTllOWQtOGMyYmJiODE5MDgyMmM5YTNmNTQtZGU0_PF84_1eb65fdf-9643-417f-9974-ad72cae0e10f";


template.innerHTML = `
  <style>

  * {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
body {
  font-family: Arial, sans-serif;
  background: #f5f5f5;
  color: #333;
  padding: 20px;
  line-height: 1.4;
}
.container {
  border-collapse: collapse;
  margin: 2rem auto;
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

/* Suchfeld */
.search {
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
}
#searchInput {
  flex: 1;
  padding: 0.5rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px 0 0 4px;
}
#searchButton {
  padding: 0.5rem 1rem;
  font-size: 1rem;
  border: none;
  background: #0072C3;
  color: #fff;
  cursor: pointer;
  border-radius: 0 4px 4px 0;
  transition: background 0.2s;
}
#searchButton:hover {
  background: #005fa3;
}

/* Spinner & Meldung */
#spinner {
  text-align: center;
  margin: 1rem 0;
}
.message {
  text-align: center;
  margin: 1rem 0;
  color: #666;
}
.hidden {
  display: none;
}

/* Tabelle */
table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
}
th, td {
  padding: 0.75rem;
  text-align: left;
  border-bottom: 1px solid #eee;
}
thead {
  background: #f2f2f2;
}
tbody tr:nth-child(even) {
  background: #fafafa;
}
tbody tr:hover {
  background: #e6f7ff;
}

/* Aktions-Buttons */
.call {
  padding: 0.3rem 0.6rem;
  margin-right: 0.3rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
}
.call {
  background: #00a884;
  color: #fff;
}
.call:hover {
  background: #008f6a;
}.consult {
  padding: 0.3rem 0.6rem;
  margin-right: 0.3rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
}
.consult {
  background: #00a884;
  color: #fff;
}
.consult:hover {
  background: #008f6a;
}
  .transfer {
  padding: 0.3rem 0.6rem;
  margin-right: 0.3rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
}
.transfer {
  background: #00a884;
  color: #fff;
}
.transfer:hover {
  background: #008f6a;
}
.video-btn {
  background: #005fa3;
  color: #fff;
}
.video-btn:hover {
  background: #004a7a;
}

  </style>

  <div class="container">
          <h1>Kontakt-Suche</h1>

    <div class="search">
      <input
        type="text"
        id="searchInput"
        placeholder="Kontakt suchen…"
        autocomplete="off"
      />
      <button class="button" id ="searchButton">Search</button>
    </div>
    <div id="spinner" class="hidden">Lade…</div>
    <div id="message" class="message"></div>

    <table id="resultsTable">
      <thead>
        <tr>
          <th>Display Name</th>
          <th>Vorname</th>
          <th>Nachname</th>
          <th>Rufnummer</th>
          <th>Aktionen</th>
        </tr>
      </thead>
      <tbody id="contacttable"><tr></tr></tbody>
    </table>
  </div>
`;

//Creating a custom logger
const logger = Desktop.logger.createLogger("jjakel");

class myDesktopSDK extends HTMLElement {
  constructor() {
    super();
    logger.info("jjakel", "started");
    // Google font
    const font = document.createElement("link");
    font.href = "https://fonts.googleapis.com/css2?family=Cutive+Mono&family=Darker+Grotesque:wght@300&family=Poppins:wght@200;400&display=swap";
    font.rel = "stylesheet";
    document.head.appendChild(font);

    // Step 1
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    this.interactionId = null;
  }

  connectedCallback() {

    logger.info("jjakel", "init");
    this.init();
    this.getAgentInfo();
  }

  disconnectedCallback() {
    // alert("remove some functions...")
    Desktop.agentContact.removeAllEventListeners();
  }

  // Sample function to print latest data of agent
  getAgentInfo() {
    const latestData = Desktop.agentStateInfo.latestData;
    logger.info("jjakel", latestData);

  }

  // Get form input fields
  inputElement(name) {
    return this.shadowRoot.getElementById(name);
  }

  // clear inputs fields on focus

  async init() {
    // Initiating desktop config
    Desktop.config.init();
    // ************************** Event listeners ************************** \\


    this.shadowRoot.querySelector("#searchButton").addEventListener("click", e => {
      logger.info("jjakel", "button clicked00");
      this.onSearch(this.inputElement("searchInput").value);
    });
    this.shadowRoot.querySelector("#searchInput").addEventListener("keyup", function(event) {
      event.preventDefault();
      if (event.keyCode === 13) {
          this.onSearch(this.inputElement("searchInput").value);
      }
    });
    // Make an OutDial Call
    
    // Transfer to Queue
    

  }

  async clearResults() {
    resultsBody.innerHTML = '';
    resultsTable.classList.add('hidden');
    showMessage('');
  }

  async showSpinner(visible) {
    spinner.classList.toggle('hidden', !visible);
  }
  // Get interactionID, but more info can be obtained from this method
  async getInteractionId() {
    const currentTaskMap = await Desktop.actions.getTaskMap();
    for (const iterator of currentTaskMap) {
      const interId = iterator[1].interactionId;
      return interId;
    }
  }

  async onSearch(value) {

    const entryPointId = this.outdialEp;
    const accesstoken = this.accessToken;

    const orgid = this.orgId;

    logger.info("jjakel", "Org ID " +orgid);
    logger.info("jjakel", this.outdialEp + accesstoken);
    logger.info("jjakel", "search started with " +value);
    //clearResults();
    //showSpinner(true);
    logger.info("jjakel", "search started 2 with " +value);
    try {
      logger.info("jjakel", "search started 3 with " +value);
      //const res = await fetch(`https://webexapis.com/v1/people?displayName=${encodeURIComponent(value)}`, {
        const res = await fetch(`https://webexapis.com/v1/contacts/organizations/${orgid}/contacts/search?keyword=${encodeURIComponent(value)}`, {
        headers: {
          'Authorization': `Bearer ${accesstoken}`
        }
      });

      if (!res.ok) {
        throw new Error(`Fehler ${res.status}`);
      }

      const data = await res.json();
      logger.info("jjakel", "search response " +data);
      const items = data.result || [];
      logger.info("jjakel", "Item Length " +items.length);
      if (items.length === 0) {
        showMessage('Keine Kontakte gefunden.');
      } else {

        logger.info("jjakel", "populate Table");

        const resultsBody   = this.shadowRoot.querySelector('tbody');
        
        resultsBody.innerHTML = '';
        logger.info("jjakel", "populate Table" +resultsBody);
        items.forEach(item => {
          const mobile = "";
          const firstName = item.firstName   || '';
          const lastName  = item.lastName    || '';
          const displayName = item.displayName    || '';
          // phone     = item.phoneNumbers[2].value;
          const phone     = (item.phoneNumbers[0].value) || '';
          logger.info("jjakel", "Result " +firstName +lastName +phone);
          const tr = document.createElement('tr');
          logger.info("jjakel", "table " +tr);
          tr.innerHTML = `
            <td>${displayName}</td>
            <td>${firstName}</td>
            <td>${lastName}</td>
            <td>${phone}</td>
            <td>

              <button class="call" id ="call" >call</button>
              <button class="consult" id ="consult" >consult</button>
              <button class="transfer" id ="transfer">transfer</button>
            </td>
          `;

          // Event-Handler für die Buttons
          

          resultsBody.appendChild(tr);
          
        });

        resultsBody.addEventListener("click", async function(e) {
          if (e.target && e.target.classList.contains("call")) {
              const row = e.target.closest("tr"); // hole die Zeile, in der der Button ist
              const name = row.cells[0].textContent;
              const phone = row.cells[4].textContent;
              logger.info("jjakel", "make Consult" +row +name +phone);
              let interId = "";
              let agentId = "";
              let destination = phone;
              let mediaId = "";

              logger.info("jjakel", "Outdial EP" +entryPointId);
              
              const outDial = await Desktop.dialer.startOutdial({
            data: {
              entryPointId: entryPointId,
              destination,
              direction: "OUTBOUND",
              attributes: {},
              mediaType: "telephony",
              outboundType: "OUTDIAL"
                }
              });
        }
        if (e.target && e.target.classList.contains("consult")) {
          const row = e.target.closest("tr"); // hole die Zeile, in der der Button ist
          const name = row.cells[0].textContent;
          const phone = row.cells[4].textContent;
          logger.info("jjakel", "make Consult" +row +name +phone);
          let interId = "";
          let agentId = "";
          let destination = "";
          let mediaId = "";
          const currentTaskMap = await Desktop.actions.getTaskMap();
          currentTaskMap.forEach (function(value, key) {
              if (value.interaction.mediaType == "telephony") {
                  interId = value.interactionId;
                  agentId = value.agentId;
                  mediaId = value.mediaResourceId;
              }
          })
          Desktop.agentContact.consult({
                                interactionId: interId,
                                data: {
                                    agentId: agentId,
                                    destAgentId: phone,
                                    mediaType: 'telephony',
                                    destinationType: "DN"
                                },
                                url: 'consult'
                            });
        }
        if (e.target && e.target.classList.contains("transfer")) {
          const row = e.target.closest("tr"); // hole die Zeile, in der der Button ist
          const name = row.cells[0].textContent;
          const phone = row.cells[4].textContent;
          logger.info("jjakel", "make transfer" +row +name +phone);
          let interId = "";
          let agentId = "";
          let destination = "";
          let mediaId = "";
          const currentTaskMap = await Desktop.actions.getTaskMap();
          currentTaskMap.forEach (function(value, key) {
              if (value.interaction.mediaType == "telephony") {
                  interId = value.interactionId;
                  agentId = value.agentId;
                  mediaId = value.mediaResourceId;
              }
          })
          let response = await Desktop.agentContact.blindTransfer({
            interactionId: interId,
            data: {
              destAgentId: phone,
              mediaType: "telephony",
              destinationType: "DN"
            }
          });
        }
      });



       /*  this.shadowRoot.querySelector("consult").addEventListener("click", e => {
          logger.info("jjakel", "make Consult" +e);
            this.makeCall(phone,true)
          });
                this.shadowRoot.getElementById("transfer").addEventListener('click', e => {
          logger.info("jjakel", "make Consult" +e);
            this.makeCall(phone,true)
          });  */

        //populateTable(items);
      }
    } catch (err) {
      //showMessage('Fehler bei der Suche. Bitte versuche es erneut.');
      logger.info("jjakel", "Error" +err);
      console.error(err);
    } finally {
      //showSpinner(false);
    }
  }


async makeCall(phone){
  logger.info("jjakel", "call" +phone);
}


 async populateTable(contacts) {
  logger.info("jjakel", "create Table");
  const resultsBody   = this.shadowRoot.querySelector('tbody');
  contacts.forEach(contact => {
    const workEntry = phoneNumbers.find(entry => entry.type === "work");

    // 3. Falls gefunden, auf value zugreifen
    if (workEntry) {
      const workNumber = workEntry.value;
      console.log("Work-Nummer:", workNumber);
    } else {
      console.log("Keine Nummer mit type='work' gefunden.");
    }
    const firstName = contact.firstName   || '';
    const lastName  = contact.lastName    || '';
    const phone     = (contact.phones && contact.phones[0] && contact.phones[0].value) || '';
    logger.info("jjakel", "Result " +firstName +lastName +phone);
    const tr = document.createElement('tr');
    logger.info("jjakel", "table " +tr);
    tr.innerHTML = `
      <td>${firstName}</td>
      <td>${lastName}</td>
      <td>${phone}</td>
      <td>
        <button class="action-btn call-btn">Sprachanruf</button>
        <button class="action-btn video-btn">Videoanruf</button>
      </td>
    `;

    // Event-Handler für die Buttons
    tr.querySelector("#searchButton").addEventListener('click', () => makeCall(workNumber, false));
    tr.querySelector("#searchButton").addEventListener('click', () => makeCall(workNumber, true));

    resultsBody.appendChild(tr);
  });

  resultsTable.classList.remove('hidden');
}

  // Make an OutDial Call
  async makeCall(entryPointId, destination) {
    //entrypoint is the OutDial Entrypoint
    //Origin is the OutDial ANI
    try {
      const outDial = await Desktop.dialer.startOutdial({
        data: {
          entryPointId,
          destination,
          direction: "OUTBOUND",
          origin: "+1xxxxxxxxxx",
          attributes: {},
          mediaType: "telephony",
          outboundType: "OUTDIAL"
        }
      });
      logger.info("myOutDial" + JSON.stringify(outDial));
    } catch (error) {
      Desktop.dialer.addEventListener("eOutdialFailed", msg => logger.info(msg));
    }
  }

  // Transfer to Queue
  async transferToQueue(queueId) {
    logger.info("jjakel", "button clicked 2");
    let interactionId = await this.getInteractionId();
    let response = await Desktop.agentContact.vteamTransfer({
      interactionId,
      data: {
        vteamId: queueId, // replace with your onw Queue
        vteamType: "inboundqueue"
      }
    });

    logger.info("transferToQueue" + JSON.stringify(response));
  }

  // Transfer to entry Point
  async transferToEntryPnt(entryPtId) {
    let interactionId = await this.getInteractionId();
    let response = await Desktop.agentContact.vteamTransfer({
      interactionId,
      data: {
        vteamId: entryPtId, // replace with your onw EP
        vteamType: "inboundentrypoint"
      }
    });

    logger.info("transferToEndpoint" + JSON.stringify(response));
  }

  // Transfer to DN ie Blind-Transfer
  async transferToDN(phoneDN) {
    let interactionId = await this.getInteractionId();
    let response = await Desktop.agentContact.blindTransfer({
      interactionId,
      data: {
        destAgentId: phoneDN,
        mediaType: "telephony",
        destinationType: "DN"
      }
    });

    logger.info("transferToDN" + JSON.stringify(response));
  }

  // Consult to Agent
  async consultToAgent(conAgentId, conDestAgentId) {
    let interactionId = await this.getInteractionId();
    let response = await Desktop.agentContact.consult({
      interactionId,

      data: {
        agentId: conAgentId, // replace with your onw Agent
        destAgentId: conDestAgentId, // replace with your onw Dest Agent
        mediaType: "telephony",
        destinationType: "Agent"
      }
    });

    logger.info("consultToAgent" + JSON.stringify(response));
  }

  async searchcontact(consultDNId) {
    logger.info("jjakel", "button clicked00" +consultDNId);

  }

  // Consult to DN
  async consultToDN(consultDNId) {
    let interactionId = await this.getInteractionId();
    let response = await Desktop.agentContact.consult({
      interactionId,

      data: {
        agentId: "dff61993-b9a3-4e74-8f57-32f92529ccd7", // replace with your onw Agent
        destAgentId: consultDNId, // replace with your onw Dest Agent
        mediaType: "telephony",
        destinationType: "DN"
      }
    });

    logger.info("consultToDN" + JSON.stringify(response));
  }

  // Hold
  async holdCall() {
    let interactionId = await this.getInteractionId();
    await Desktop.agentContact.hold({
      interactionId,
      data: {
        mediaResourceId: interactionId
      }
    });
    logger.info("holdMyCall" + JSON.stringify(response));
  }

  // unHold
  async unHoldCall() {
    let interactionId = await this.getInteractionId();
    await Desktop.agentContact.unHold({
      interactionId,
      data: {
        mediaResourceId: interactionId
      }
    });
    logger.info("unHoldMyCall" + JSON.stringify(response));
  }

  // Pause Recording
  async pauseRecord() {
    let interactionId = await this.getInteractionId();
    await Desktop.agentContact.pauseRecording({
      interactionId
    });
  }
}

customElements.define("contact-search", myDesktopSDK);
