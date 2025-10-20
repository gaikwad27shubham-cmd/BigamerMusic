using BigamerMusic.Models;
using BigamerMusic.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace BigamerMusic.Areas.User.Controllers
{
    [Area("User")]
    public class UploadedMusicController : Controller
    {
        private readonly IActionRepository _repo;
        public UploadedMusicController(IActionRepository repo)
        {
            _repo = repo;
        }
        // GET: UploadedMusicController
        public ActionResult ListOfMusic()
        {
            return View();
        }

        // GET: UploadedMusicController/Details/5
        public ActionResult Details(int id)
        {
            return View();
        }

        // GET: UploadedMusicController/Create
        public ActionResult Create()
        {
            return View();
        }

        // POST: UploadedMusicController/Create
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Create(IFormCollection collection)
        {
            try
            {
                return RedirectToAction(nameof(Index));
            }
            catch
            {
                return View();
            }
        }

        // GET: UploadedMusicController/Edit/5
        public ActionResult Edit(int id)
        {
            return View();
        }

        // POST: UploadedMusicController/Edit/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, IFormCollection collection, string formXml)
        {
            try
            {
                var modal = new ActionModal
                {
                    ProcName = "sp_SaveForm",
                    formXml = formXml,
                    PrimaryId = 0,
                    UserID = 123,
                    RoleID = 1
                };

                var result = await _repo.ExecuteProcedureAsync(modal);
                return RedirectToAction(nameof(Index));
            }
            catch
            {
                return View();
            }
        }

        // GET: UploadedMusicController/Delete/5
        public ActionResult Delete(int id)
        {
            return View();
        }

        // POST: UploadedMusicController/Delete/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Delete(int id, IFormCollection collection)
        {
            try
            {
                return RedirectToAction(nameof(Index));
            }
            catch
            {
                return View();
            }
        }
    }
}
