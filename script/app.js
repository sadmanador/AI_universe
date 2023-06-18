const loadTools = () => {
  toggleSpinner(true);
  const url = "https://openapi.programming-hero.com/api/ai/tools";
  fetch(url)
    .then((res) => res.json())
    .then((data) => displayTools(data.data.tools));
};

const displayTools = (data) => {
  const toolsContainer = document.getElementById("tools-display");

  //see more
  document.getElementById("see-more").addEventListener("click", () => {
    toolsContainer.innerHTML = "";

    displayCards(data);

    toggleSpinner(false);
    document.getElementById("see-more").style.display = "none";
  });

  //sort recent
  document.getElementById("sort-recent").addEventListener("click", (event) => {
    sorDate = (a, b) => {
      const dateA = new Date(a.published_in);
      const dateB = new Date(b.published_in);
      if (dateA < dateB) {
        return 1;
      } else if (dateA > dateB) {
        return -1;
      } else {
        return 0;
      }
    };
    const tools = data.sort(sorDate).slice(0,6);
    toolsContainer.innerHTML = "";

    displayCards(tools);

    toggleSpinner(false);
  });

  //sort older
  document.getElementById("sort-old").addEventListener("click", (event) => {
    sorDate = (a, b) => {
      const dateA = new Date(a.published_in);
      const dateB = new Date(b.published_in);
      if (dateA < dateB) {
        return -1;
      } else if (dateA > dateB) {
        return 1;
      } else {
        return 0;
      }
    };
    const tools = data.sort(sorDate).slice(0, 6);
    toolsContainer.innerHTML = "";

    displayCards(tools);

    toggleSpinner(false);
  });

  const tools = data.slice(0, 6);

  displayCards(tools);
  toggleSpinner(false);
};




const displayCards = (tools) => {
  const toolsContainer = document.getElementById("tools-display");
  tools.forEach((tool) => {
    const { name, id, image, features, published_in } = tool;

    //date formatting
    const date = new Date(published_in);
    const publishDate = date.toDateString();

    const toolCard = document.createElement("div");
    let classesToAdd = [
      "card",
      "card-compact",
      "w-96",
      "bg-base-100",
      "shadow-xl",
      "text-start",
      "mx-auto",
    ];
    toolCard.classList.add(...classesToAdd);
    toolCard.innerHTML = `
                  <figure><img src="${image}" alt="Shoes" /></figure>
                  <div class="card-body">
                      <h3 class='pl-4 font-semibold text-xl'>Features</h3>
                      <ol class='list-decimal pl-4'>
                          ${features.map((fe) => `<li>${fe}</li>`).join("")}
                      </ol>
                  
                  </div>
      
                  <hr>
                  <div class="card-footer flex justify-between p-5">
                  <div>
                      <h2 class="card-title text-2xl font-bold">${name}</h2>
                      <p><i class="lni lni-calendar"></i> <span>${publishDate}</span></p>
                  </div>
                  <div class="card-actions">
                      <label for="my-modal" class="btn btn-outline btn-error" onclick='loadDetailTool("${id}")'><i class="lni lni-arrow-right font-bold"></i></label>
                  </div>
                  </div>
              `;
    toolsContainer.appendChild(toolCard);
  });
};

const loadDetailTool = (id) => {
  const url = `https://openapi.programming-hero.com/api/ai/tool/${id}`;
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      displayModalTool(data.data);
    });
};

const displayModalTool = (tools) => {
  const modalContainer = document.getElementById("modal");

  const {
    accuracy,
    description,
    integrations,
    features,
    image_link,
    pricing,
    input_output_examples,
  } = tools;

  const { score } = accuracy;
  const featureValues = Object.values(features);
  modalContainer.innerHTML = "";

  const modalContent = document.createElement("div");
  let classesToAdd = ["modal-box", "relative", "max-w-6xl"];
  modalContent.classList.add(...classesToAdd);
  modalContent.innerHTML = `
  <section class="grid grid-cols-1 md:grid-cols-2 gap-5 p-3">
  <label for="my-modal" class="btn btn-sm btn-circle absolute right-1 top-1 bg-red-400">✕</label>
 <div class="pricing-details hover:bg-red-50 hover:border-red-300 border border-2  p-12 rounded-2xl border border-2">
     <h3 class="font-semibold text-3xl">
         ${description}
     </h3>
     <div class="flex flex-col sm:flex-row gap-2 justify-around my-10">
         <div class="font-semibold text-center bg-white p-5 rounded-2xl text-green-500">
           <p>${pricing ? pricing?.[0].plan : "Free of Cost"}</p>
           <p>${pricing ? pricing?.[0].price : "$0/month"}</p>
         </div>
         <div class="font-semibold text-center bg-white p-5 rounded-2xl text-orange-400">
           <p>${pricing ? pricing?.[1].plan : "Free of Cost"}</p>
           <p>${pricing ? pricing?.[1].price : "$0/month"}</p>
         </div>
         <div class="font-semibold text-center bg-white p-5 rounded-2xl text-red-500">
           <p>${pricing ? pricing?.[2].plan : "Free of Cost"}</p>
           <p>${pricing ? pricing?.[2].price : "$0/month"}</p>
         </div>
     </div>
     <div class="flex flex-col sm:flex-row justify-between gap-2">
         <div>
             <h3 class="font-semibold text-3xl">Features</h3>
             <ul class="list-disc text-start">
                 ${featureValues
                   .map((fev) => `<li>${fev.feature_name}</li>`)
                   .join("")}
             </ul>
         </div>
         <div>
             <h3 class="font-semibold text-3xl">Integrations</h3>
             <ul class="list-disc text-start">
             ${
               integrations === null
                 ? "<li>" + "No Data Found" + "</li>"
                 : integrations?.map((intg) => `<li>${intg}</li>`).join("")
             }
             </ul>
         </div>
     </div>
 </div>
 <div class="view-card p-12 rounded-2xl hover:bg-red-50 hover:border-red-300 border border-2 relative">
     <div class='mb-10'>
         <p href="#" class="bg-red-400 hover:text-white hover:bg-red-600 rounded-lg font-semibold py-2 px-2 inline-block absolute right-12 top-15 lowercase ${
           accuracy?.score ? "block" : "hidden"
         }"><span class='ml-2'>${
    accuracy.score * 100
  }% </span> <span> accuracy</span></p>
         <img class='rounded-lg' src="${image_link[0]}">
     </div>
     <h3 class="font-semibold text-3xl my-10">
     ${
       input_output_examples
         ? input_output_examples[0].input
         : "Can you give any example?"
     }
     </h3>
     <p>
       ${
         input_output_examples
           ? input_output_examples[0].output
           : "No! Not Yet! Take a break!!!"
       }
     </p>
 </div>
</section>
  `;
  modalContainer.appendChild(modalContent);
};

const toggleSpinner = (isLoading) => {
  const loaderId = document.getElementById("spinner");
  if (isLoading) {
    loaderId.classList.remove("hidden");
  } else {
    loaderId.classList.add("hidden");
  }
};

//clear the modal upon closing
const clearModal = () => {
  const modalContainer = document.getElementById("modal");
  modalContainer.innerHTML = "";
};


loadTools();
