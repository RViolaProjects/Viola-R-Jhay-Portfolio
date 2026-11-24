/* Portfolio interactions: project gallery, navigation, contact. */
// Keep the copyright year current without editing the HTML each year.
    document.getElementById("year").textContent = new Date().getFullYear();

    // Project information and image paths for the pop-up project viewer.
    // Put your screenshots in images/projects/ and add their filenames below.
    // To customize missing photo explanations, edit missingPhotoMessage for each project.
    // Set projectUrl to your published HTTPS project link; leave it empty to hide the link.
    const projectDetails = {
      "inventory": { projectUrl: "", type: "INTERNSHIP / DESKTOP APPLICATION", title: "Purchase Order & Tool Room Inventory System", description: "Developed during my IT internship to support purchase order processing and tool room inventory management.", tags: ["VB.NET", "WINDOWS FORMS", "MS ACCESS"], images: ["images/projects/inventory-1.jpg", "images/projects/inventory-2.jpg", "images/projects/inventory-3.jpg", "images/projects/inventory-4.jpg", "images/projects/inventory-5.jpg", "images/projects/inventory-6.jpg"], missingPhotoMessage: "Photos from this internship project are not available because I have not been able to reconnect with my previous employer to obtain the images and permission to share them. I plan to remake this project using a fictional brand and sample data." },
      "drink-system": { projectUrl: "", type: "DESKTOP APPLICATION", title: "Customizable Drink System", description: "A Visual Basic .NET application with separate customer and staff interfaces.", tags: ["VB.NET", "USER INTERFACE"], images: ["images/projects/drink-system-1.jpg", "images/projects/drink-system-2.jpg", "images/projects/drink-system-3.jpg", "images/projects/drink-system-4.jpg", "images/projects/drink-system-5.jpg", "images/projects/drink-system-6.jpg"], missingPhotoMessage: "Screenshots for this project have not been added yet. I plan to prepare updated images and a fictional-brand demonstration." },
      "school-web": { projectUrl: "", type: "WEB DEVELOPMENT", title: "School Map & Portfolio Website", description: "Web development projects created to present information and provide a simple way for users to navigate content.", tags: ["HTML", "CSS", "JAVASCRIPT"], images: ["images/projects/school-web-1.png", "images/projects/school-web-2.png", "images/projects/school-web-3.png", "images/projects/school-web-4.png", "images/projects/school-web-5.png", "images/projects/school-web-6.png", "images/projects/school-web-7.png"], missingPhotoMessage: "Screenshots for this web project have not been added yet. I plan to upload them when available." },
      "medicine-box": { projectUrl: "", type: "COMPUTER ENGINEERING THESIS", title: "Medicine Box with Alarm", description: "An application-assisted, alarm-equipped medicine box project combining software and hardware components.", tags: ["HARDWARE", "EMBEDDED SYSTEM"], images: ["images/projects/medicine-box-1.jpg", "images/projects/medicine-box-2.jpg", "images/projects/medicine-box-3.jpg", "images/projects/medicine-box-4.jpg", "images/projects/medicine-box-5.jpg", "images/projects/medicine-box-6.jpg"], missingPhotoMessage: "Photos of this thesis hardware project have not been added yet. I plan to add them when available." },
      "bluemed": { projectUrl: "", type: "MOBILE APPLICATION", title: "BlueMed Android Application", description: "An Android application developed in connection with the medicine box thesis project.", tags: ["ANDROID", "MOBILE APP"], images: ["images/projects/bluemed-1.jpg", "images/projects/bluemed-2.jpg", "images/projects/bluemed-3.jpg", "images/projects/bluemed-4.jpg", "images/projects/bluemed-5.jpg", "images/projects/bluemed-6.jpg"], missingPhotoMessage: "Screenshots of this Android application have not been added yet. I plan to upload them when available." },
      "line-follower": { projectUrl: "", type: "ROBOTICS PROJECT", title: "Line-Follower Robot", description: "A robotics project built around an ESP32 microcontroller.", tags: ["ESP32", "ROBOTICS"], images: ["images/projects/line-follower-1.jpg", "images/projects/line-follower-2.jpg", "images/projects/line-follower-3.jpg", "images/projects/line-follower-4.jpg", "images/projects/line-follower-5.jpg", "images/projects/line-follower-6.jpg"], missingPhotoMessage: "Photos of this robotics project have not been added yet. I plan to add them when available." },
      "dosebound": { projectUrl: "", type: "ANDROID APP / PERSONAL PROJECT", title: "Dosebound — Medicine Reminder App", description: "A pixel-art medicine reminder and tracking app made with Godot for portrait Android screens. It includes medicine schedules, dose logging, remaining-stock tracking, a calendar, diary and notes, and an interactive clock-style reminder picker. Offline backup and restore are part of the app design; background alarm delivery after the app is closed may require additional Android integration.", tags: ["GODOT 4", "GDSCRIPT", "ANDROID", "PIXEL ART"], images: ["images/projects/dosebound-1.png", "images/projects/dosebound-2.png", "images/projects/dosebound-3.png", "images/projects/dosebound-4.png", "images/projects/dosebound-5.png", "images/projects/dosebound-6.png"], missingPhotoMessage: "Screenshots of Dosebound have not been added yet. I plan to upload images of the medicine schedule, calendar, diary, and reminder clock as I continue developing the app." },
      "pixel-quest-daybook": { projectUrl: "https://rviolaprojects.github.io/Pixel-Quest-Dayboook/", type: "WEB APP / PERSONAL PROJECT", title: "Pixel Quest Daybook — Pixel-Art Planner", description: "A personal productivity web app designed around my love of retro gaming and pixel graphics. It helps organize daily tasks and planning in a playful, pixel-art interface. The app uses browser-based storage and supports manual backup and restore, without requiring a Google sign-in.", tags: ["HTML", "CSS", "JAVASCRIPT", "PIXEL ART"], images: ["images/projects/pixel-quest-daybook-1.png", "images/projects/pixel-quest-daybook-2.png", "images/projects/pixel-quest-daybook-3.png", "images/projects/pixel-quest-daybook-4.png", "images/projects/pixel-quest-daybook-5.png", "images/projects/pixel-quest-daybook-6.png"], missingPhotoMessage: "Screenshots of Pixel Quest Daybook have not been added yet. I plan to share previews of the planner, task organization, and pixel-art interface." },
      "zombie-sky": { projectUrl: "", type: "2D PIXEL-ART GAME", title: "Zombie Sky — Flying Zombie Game", description: "A Godot 4 endless-flying game inspired by tap-to-fly gameplay, with an original flying zombie, brain collectibles, quests, XP and levels, a cosmetic zombie shop, and local save support. The game uses a spooky but friendly pixel-art world and editable Aseprite artwork.", tags: ["GODOT 4", "GDSCRIPT", "PIXEL ART", "ASEPRITE"], images: ["images/projects/zombie-sky-1.png", "images/projects/zombie-sky-2.png", "images/projects/zombie-sky-3.png", "images/projects/zombie-sky-4.png", "images/projects/zombie-sky-5.png", "images/projects/zombie-sky-6.png"], missingPhotoMessage: "Screenshots of Zombie Sky have not been added to this portfolio yet. I plan to upload gameplay screenshots and artwork previews as I continue refining the game." }
    };

    const projectModal = document.getElementById('projectModal');
    const projectWindow = projectModal.querySelector('.project-window');
    const projectGallery = document.getElementById('projectGallery');
    const galleryEmpty = document.getElementById('galleryEmpty');
    const galleryControls = document.getElementById('galleryControls');
    let activeImages = [];
    let activeImageIndex = 0;
    let lastFocusedElement = null;

    // Each project has its own missingPhotoMessage in projectDetails above.
    // Edit that field to explain why a particular project's photos are unavailable.
    let activeProject = null;
    function showMissingPhotos() {
      galleryEmpty.replaceChildren();
      const heading = document.createElement('strong');
      heading.textContent = 'SCREENSHOTS NOT AVAILABLE YET';
      const explanation = document.createElement('small');
      explanation.textContent = activeProject?.missingPhotoMessage || 'Project photos will be added soon.';
      galleryEmpty.append(heading, document.createElement('br'), explanation);
      galleryEmpty.hidden = false;
      galleryControls.hidden = true;
      document.getElementById('galleryCount').textContent = '0 IMAGES';
    }

    function renderProjectImage() {
      projectGallery.querySelectorAll('.gallery-image').forEach(image => image.remove());
      const imagePath = activeImages[activeImageIndex];
      if (!imagePath) return;
      const image = document.createElement('img');
      image.className = 'gallery-image';
      image.alt = 'Project screenshot ' + (activeImageIndex + 1);
      image.addEventListener('error', () => {
        image.remove();
        showMissingPhotos();
      }, { once: true });
      image.addEventListener('load', () => {
        galleryEmpty.hidden = true;
        galleryControls.hidden = activeImages.length < 2;
        document.getElementById('galleryCount').textContent = activeImages.length + (activeImages.length === 1 ? ' IMAGE' : ' IMAGES');
        document.getElementById('galleryPosition').textContent = (activeImageIndex + 1) + ' / ' + activeImages.length;
      }, { once: true });
      projectGallery.appendChild(image);
      image.src = imagePath;
    }

    // Check image availability so missing screenshots do not break NEXT/PREVIOUS.
    function imageExists(path) {
      return new Promise(resolve => {
        const test = new Image();
        test.onload = () => resolve(true);
        test.onerror = () => resolve(false);
        test.src = path;
      });
    }

    async function openProject(projectKey, trigger) {
      const project = projectDetails[projectKey];
      if (!project) return;
      lastFocusedElement = trigger;
      activeProject = project;
      document.getElementById('modalType').textContent = project.type;
      document.getElementById('modalTitle').textContent = project.title;
      document.getElementById('modalDescription').textContent = project.description;
      // Reset the link every time so it cannot carry over from another project.
      const projectLink = document.getElementById('modalProjectLink');
      projectLink.hidden = true;
      projectLink.removeAttribute('href');
      try {
        const url = new URL((project.projectUrl || '').trim());
        if (url.protocol === 'https:' || url.protocol === 'http:') {
          projectLink.href = url.href;
          projectLink.hidden = false;
        }
      } catch { /* No valid project URL: keep the link hidden. */ }
      const tags = document.getElementById('modalTags');
      tags.innerHTML = '';
      project.tags.forEach(tag => {
        const item = document.createElement('span');
        item.textContent = tag;
        tags.appendChild(item);
      });
      projectGallery.querySelectorAll('.gallery-image').forEach(image => image.remove());
      activeImages = [];
      activeImageIndex = 0;
      galleryEmpty.hidden = false;
      galleryEmpty.innerHTML = 'LOADING PROJECT SCREENSHOTS...';
      galleryControls.hidden = true;
      document.getElementById('galleryCount').textContent = '...';
      projectModal.classList.add('is-open');
      projectModal.setAttribute('aria-hidden', 'false');
      document.body.classList.add('modal-open');
      projectWindow.focus();
      // Only display images that have actually been added to the project folder.
      const results = await Promise.all(project.images.map(imageExists));
      if (!projectModal.classList.contains('is-open') || document.getElementById('modalTitle').textContent !== project.title) return;
      activeImages = project.images.filter((_, i) => results[i]);
      if (activeImages.length) {
        renderProjectImage();
      } else {
        showMissingPhotos();
      }
    }

    function closeProject() {
      projectModal.classList.remove('is-open');
      projectModal.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('modal-open');
      if (lastFocusedElement) lastFocusedElement.focus();
    }

    document.querySelectorAll('[data-open-project]').forEach(button => {
      button.addEventListener('click', () => openProject(button.dataset.openProject, button));
    });
    document.querySelectorAll('[data-close-project]').forEach(button => button.addEventListener('click', closeProject));
    document.getElementById('galleryPrev').addEventListener('click', () => {
      if (!activeImages.length) return;
      activeImageIndex = (activeImageIndex - 1 + activeImages.length) % activeImages.length;
      renderProjectImage();
    });
    document.getElementById('galleryNext').addEventListener('click', () => {
      if (!activeImages.length) return;
      activeImageIndex = (activeImageIndex + 1) % activeImages.length;
      renderProjectImage();
    });
    document.addEventListener('keydown', event => {
      if (!projectModal.classList.contains('is-open')) return;
      if (event.key === 'Escape') closeProject();
      if (event.key === 'ArrowLeft') document.getElementById('galleryPrev').click();
      if (event.key === 'ArrowRight') document.getElementById('galleryNext').click();
    });

    // Highlight the navigation link for the section currently on screen.
    const navLinks = document.querySelectorAll('.main-nav a');
    const sections = document.querySelectorAll('main section[id]');
    // IntersectionObserver avoids running a scroll handler on every scroll event.
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            navLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === '#' + entry.target.id));
          }
        });
      }, { rootMargin: '-35% 0px -55% 0px' });
      sections.forEach(section => observer.observe(section));
    }

// Contact actions: mailto requires a configured mail application.
const copyEmailButton = document.getElementById("copyEmailButton");
const contactFeedback = document.getElementById("contactFeedback");
if (copyEmailButton && contactFeedback) {
  copyEmailButton.addEventListener("click", async () => {
    const email = "rjhayviola16@gmail.com";
    try {
      await navigator.clipboard.writeText(email);
      contactFeedback.textContent = "EMAIL ADDRESS COPIED!";
    } catch (error) {
      contactFeedback.textContent = "COPY THIS EMAIL: " + email;
    }
  });
}
